import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals, params }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const env = (locals as any).runtime?.env;
  const row = await queryFirst(env.DB, `SELECT * FROM matches WHERE id=? AND club_id=?`, [params.id, locals.clubId]);
  if (!row) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(row), { headers: { 'Content-Type': 'application/json' } });
};

export const PUT: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const b = await request.json() as any;
  await execute(env.DB,
    `UPDATE matches SET team_id=?, opponent_name=?, match_date=?, location=?, is_home=?,
     competition=?, score_home=?, score_away=?, status=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=? AND club_id=?`,
    [b.team_id, b.opponent_name, b.match_date, b.location||null, b.is_home??1,
     b.competition||null, b.score_home??null, b.score_away??null, b.status||'SCHEDULED',
     params.id, locals.clubId]);
  return new Response(JSON.stringify({ ok: true }));
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  await execute(env.DB, `UPDATE matches SET status='CANCELLED', updated_at=CURRENT_TIMESTAMP WHERE id=? AND club_id=?`, [params.id, locals.clubId]);
  return new Response(JSON.stringify({ ok: true }));
};
