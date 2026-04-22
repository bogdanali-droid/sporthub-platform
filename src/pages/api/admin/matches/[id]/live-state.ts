import type { APIRoute } from 'astro';
import { queryFirst, queryAll, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals, params }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  const clubId = (locals as any).clubId ?? locals.user?.club_id;
  const id = params.id;

  const [match, events, evals] = await Promise.all([
    queryFirst<any>(db, `SELECT * FROM matches WHERE id=? AND club_id=?`, [id, clubId]),
    queryAll<any>(db,
      `SELECT me.*, p.first_name || ' ' || p.last_name AS player_name
       FROM match_events me
       LEFT JOIN players p ON p.id = me.player_id
       WHERE me.match_id=? ORDER BY me.created_at DESC LIMIT 50`, [id]),
    queryAll<any>(db,
      `SELECT mes.*, p.first_name || ' ' || p.last_name AS player_name
       FROM match_eval_scores mes
       JOIN players p ON p.id = mes.player_id
       WHERE mes.match_id=?`, [id]),
  ]);

  if (!match) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  return new Response(JSON.stringify({
    match,
    period_data: match.period_data ? JSON.parse(match.period_data) : [],
    events,
    evals,
  }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
};

export const POST: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const clubId = (locals as any).clubId ?? locals.user?.club_id;
  const id = params.id;
  const body = await request.json() as any;

  const match = await queryFirst<any>(db, `SELECT * FROM matches WHERE id=? AND club_id=?`, [id, clubId]);
  if (!match) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  const { current_inning, current_half, outs_count } = body;

  await execute(db,
    `UPDATE matches SET current_inning=?, current_half=?, outs_count=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND club_id=?`,
    [current_inning ?? match.current_inning, current_half ?? match.current_half, outs_count ?? match.outs_count, id, clubId]);

  const updated = await queryFirst<any>(db, `SELECT * FROM matches WHERE id=? AND club_id=?`, [id, clubId]);

  return new Response(JSON.stringify({
    match: updated,
    period_data: updated?.period_data ? JSON.parse(updated.period_data) : [],
  }), { headers: { 'Content-Type': 'application/json' } });
};
