import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals, params }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const env = (locals as any).runtime?.env;
  const team = await queryFirst(env.DB,
    `SELECT * FROM teams WHERE id = ? AND club_id = ?`,
    [params.id, locals.clubId]);
  if (!team) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(team), { headers: { 'Content-Type': 'application/json' } });
};

export const PUT: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const b = await request.json() as any;
  await execute(env.DB,
    `UPDATE teams SET name=?, age_group=?, coach_id=?, season=?, jersey_color_primary=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=? AND club_id=?`,
    [b.name, b.age_group, b.coach_id || null, b.season || null, b.jersey_color_primary || '#0f4c81', params.id, locals.clubId]);
  return new Response(JSON.stringify({ ok: true }));
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  await execute(env.DB,
    `UPDATE teams SET is_active=0, updated_at=CURRENT_TIMESTAMP WHERE id=? AND club_id=?`,
    [params.id, locals.clubId]);
  return new Response(JSON.stringify({ ok: true }));
};
