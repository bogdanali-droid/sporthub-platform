import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals, params }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const env = (locals as any).runtime?.env;
  const row = await queryFirst(env.DB, `SELECT * FROM trainings WHERE id=? AND club_id=?`, [params.id, locals.clubId]);
  if (!row) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(row), { headers: { 'Content-Type': 'application/json' } });
};

export const PUT: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','COACH','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const b = await request.json() as any;
  await execute(env.DB,
    `UPDATE trainings SET title=?, team_id=?, start_time=?, end_time=?, location=?, notes=?, status=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=? AND club_id=?`,
    [b.title, b.team_id, b.start_time, b.end_time||null, b.location||null, b.notes||null, b.status||'SCHEDULED', params.id, locals.clubId]);
  return new Response(JSON.stringify({ ok: true }));
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  if (!locals.user || !['ADMIN','COACH','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  await execute(env.DB, `UPDATE trainings SET status='CANCELLED', updated_at=CURRENT_TIMESTAMP WHERE id=? AND club_id=?`, [params.id, locals.clubId]);
  return new Response(JSON.stringify({ ok: true }));
};
