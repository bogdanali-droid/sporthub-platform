import { defineMiddleware } from 'astro:middleware';
import { getSession, refreshSession } from '@/lib/auth';

const PUBLIC_PATHS = [
  '/login', '/onboarding', '/forgot-password', '/reset-password',
  '/api/auth/login', '/api/auth/forgot-password', '/api/auth/reset-password',
  '/api/onboarding/setup', '/check-in', '/api/check-in',
  '/prezenta', '/api/prezenta', '/sanatate', '/api/sanatate',
  '/disponibil', '/api/disponibil', '/meci', '/api/matches', '/api/ical',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p + '?'));
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
    return redirect('/login');
  }

  const env = (locals as any).runtime?.env;
  if (!env) return next();

  const session = await getSession(sessionToken, env);

  if (!session) {
    cookies.delete('session', { path: '/' });
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Session expired' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    return redirect('/login');
  }

  locals.user = session.user;
  locals.clubId = session.user.club_id;

  if (url.pathname.startsWith('/superadmin') || url.pathname.startsWith('/api/superadmin')) {
    if (session.user.role !== 'SUPERADMIN') {
      if (url.pathname.startsWith('/api/')) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      return redirect('/admin');
    }
  }

  if (url.pathname.startsWith('/parent') || url.pathname.startsWith('/api/parent')) {
    if (session.user.role !== 'PARENT' && session.user.role !== 'SUPERADMIN') {
      if (url.pathname.startsWith('/api/')) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      return redirect('/admin');
    }
  }

  if (url.pathname.startsWith('/coach') || url.pathname.startsWith('/api/coach')) {
    if (!['COACH', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      if (url.pathname.startsWith('/api/')) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      return redirect('/login');
    }
  }

  if ((url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) && session.user.role === 'PARENT') {
    if (url.pathname.startsWith('/api/')) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    return redirect('/parent');
  }

  await refreshSession(sessionToken, env).catch(() => {});
  return next();
});
