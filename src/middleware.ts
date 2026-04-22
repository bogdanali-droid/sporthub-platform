import { defineMiddleware } from 'astro:middleware';
import { getSession, refreshSession } from '@/lib/auth';

const PUBLIC_PATHS = [
  '/login', '/onboarding', '/forgot-password', '/reset-password',
  '/api/auth/login', '/api/auth/logout', '/api/auth/forgot-password', '/api/auth/reset-password',
  '/api/onboarding/setup', '/check-in', '/api/check-in',
  '/prezenta', '/api/prezenta', '/sanatate', '/api/sanatate',
  '/disponibil', '/api/disponibil', '/meci', '/api/matches', '/api/ical',
  '/api/health',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p + '?'));
}

function forbidden(isApi: boolean, redirectTo = '/login') {
  if (isApi) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  return Response.redirect(redirectTo, 302);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, cookies, redirect, locals, url } = context;

  locals.clientIP =
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For') ?? 'unknown';

  locals.user = null;
  locals.clubId = null;

  if (isPublicPath(url.pathname) || url.pathname === '/') return next();

  const sessionToken = cookies.get('session')?.value;

  if (!sessionToken) {
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname.startsWith('/federatie-admin') || url.pathname.startsWith('/asociatie-admin')) {
      return redirect('/login');
    }
    return redirect('/login');
  }

  const env = (locals as any).runtime?.env;

  // Dacă SESSION_KV nu e configurat, tratăm ca sesiune invalidă
  if (!env?.SESSION_KV) {
    cookies.delete('session', { path: '/' });
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Service unavailable — bindings not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname.startsWith('/federatie-admin') || url.pathname.startsWith('/asociatie-admin')) {
      return redirect('/login');
    }
    return redirect('/login');
  }

  let session = null;
  try {
    session = await getSession(sessionToken, env);
  } catch {
    cookies.delete('session', { path: '/' });
  }

  if (!session) {
    cookies.delete('session', { path: '/' });
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Session expired' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname.startsWith('/federatie-admin') || url.pathname.startsWith('/asociatie-admin')) {
      return redirect('/login');
    }
    return redirect('/login');
  }

  locals.user = {
    ...session.user,
    club_id: session.user.impersonated_club_id ?? session.user.club_id,
  };
  locals.clubId = locals.user.club_id;

  const { role } = session.user;
  const isApi = url.pathname.startsWith('/api/');
  const path = url.pathname;

  // SuperAdmin — acces total
  if (path.startsWith('/superadmin') || path.startsWith('/api/superadmin')) {
    if (role !== 'SUPERADMIN') return forbidden(isApi, '/admin');
  }

  // Portal Federație — FEDERATION_ADMIN sau SUPERADMIN
  if (path.startsWith('/federatie-admin') || path.startsWith('/api/federatie-admin')) {
    if (!['FEDERATION_ADMIN', 'SUPERADMIN'].includes(role)) {
      return forbidden(isApi, '/login/federatie');
    }
  }

  // Portal Asociație — ASSOCIATION_ADMIN, FEDERATION_ADMIN sau SUPERADMIN
  if (path.startsWith('/asociatie-admin') || path.startsWith('/api/asociatie-admin')) {
    if (!['ASSOCIATION_ADMIN', 'FEDERATION_ADMIN', 'SUPERADMIN'].includes(role)) {
      return forbidden(isApi, '/login/federatie');
    }
  }

  // Portal Jucător
  if (path.startsWith('/player') || path.startsWith('/api/player')) {
    if (!['PLAYER', 'SUPERADMIN'].includes(role)) {
      return forbidden(isApi, '/admin');
    }
  }

  // Portal Parinte
  if (path.startsWith('/parent') || path.startsWith('/api/parent')) {
    if (!['PARENT', 'SUPERADMIN'].includes(role)) return forbidden(isApi, '/admin');
  }

  // Coach
  if (path.startsWith('/coach') || path.startsWith('/api/coach')) {
    if (!['COACH', 'ADMIN', 'SUPERADMIN'].includes(role)) return forbidden(isApi, '/login');
  }

  // FEDERATION_ADMIN/SUPERADMIN accessing /admin without a club selected → pick one first
  if (path.startsWith('/admin') && !path.startsWith('/admin/club-select') && !isApi) {
    if (['FEDERATION_ADMIN', 'SUPERADMIN'].includes(role) && !session.user.club_id && !session.user.impersonated_club_id) {
      return redirect('/admin/club-select');
    }
  }

  // Admin — PARENT nu are acces, redirect la /parent
  if ((path.startsWith('/admin') || path.startsWith('/api/admin')) && role === 'PARENT') {
    return forbidden(isApi, '/parent');
  }

  // PLAYER redirect la /player din /admin
  if ((path.startsWith('/admin') || path.startsWith('/api/admin')) && role === 'PLAYER') {
    return forbidden(isApi, '/player');
  }

  await refreshSession(sessionToken, env).catch(() => {});
  return next();
});
