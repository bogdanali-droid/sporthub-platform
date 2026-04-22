import type { APIRoute } from 'astro';
import { setActiveSport } from '@/lib/auth';

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const user = locals.user;
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const token = cookies.get('session')?.value;
  if (!token) return new Response(JSON.stringify({ error: 'No session' }), { status: 401 });

  const { sport_code } = await request.json() as { sport_code: string };
  if (!sport_code) return new Response(JSON.stringify({ error: 'sport_code required' }), { status: 400 });

  const env = (locals as any).runtime?.env;
  await setActiveSport(token, sport_code, env);

  // Determine redirect based on role
  const role = user.role;
  let redirect = '/admin';
  if (role === 'FEDERATION_ADMIN') redirect = '/federatie-admin';
  else if (role === 'ASSOCIATION_ADMIN') redirect = '/asociatie-admin';
  else if (role === 'PARENT') redirect = '/parent';
  else if (role === 'PLAYER') redirect = '/player';

  return new Response(JSON.stringify({ ok: true, redirect }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
