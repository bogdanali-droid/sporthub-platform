import type { APIRoute } from 'astro';
import { setImpersonatedClub } from '@/lib/auth';

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const user = locals.user;
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  if (!['FEDERATION_ADMIN', 'SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const token = cookies.get('session')?.value;
  if (!token) return new Response(JSON.stringify({ error: 'No session' }), { status: 401 });

  const { club_id } = await request.json() as { club_id: string | null };
  const env = (locals as any).runtime?.env;
  await setImpersonatedClub(token, club_id ?? null, env);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
