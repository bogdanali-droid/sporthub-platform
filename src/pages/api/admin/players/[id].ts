import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals, params }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const env = (locals as any).runtime?.env;
  const player = await queryFirst(env.DB,
    `SELECT * FROM players WHERE id = ? AND club_id = ?`,
    [params.id, locals.clubId]);
  if (!player) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(player), { headers: { 'Content-Type': 'application/json' } });
};

export const PUT: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const b = await request.json() as any;
  await execute(env.DB,
    `UPDATE players SET
       first_name=?, last_name=?, birth_date=?, gender=?, position=?,
       jersey_number=?, status=?, parent_email=?, parent_phone=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=? AND club_id=?`,
    [b.first_name, b.last_name, b.birth_date, b.gender||null, b.position||null,
     b.jersey_number||null, b.status||'ACTIVE', b.parent_email||null, b.parent_phone||null,
     params.id, locals.clubId]);
  return new Response(JSON.stringify({ ok: true }));
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  await execute(env.DB,
    `UPDATE players SET status='INACTIVE', updated_at=CURRENT_TIMESTAMP WHERE id=? AND club_id=?`,
    [params.id, locals.clubId]);
  return new Response(JSON.stringify({ ok: true }));
};
