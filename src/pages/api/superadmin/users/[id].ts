import type { APIRoute } from 'astro';
import { execute } from '@/lib/db';

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  const user = locals.user;
  if (!user || user.role !== 'SUPERADMIN') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const { id } = params;
  const { sport_codes } = await request.json() as { sport_codes: string[] };

  const env = (locals as any).runtime?.env;
  await execute(env.DB, 'UPDATE users SET sport_codes = ? WHERE id = ?', [
    JSON.stringify(sport_codes),
    id,
  ]);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
