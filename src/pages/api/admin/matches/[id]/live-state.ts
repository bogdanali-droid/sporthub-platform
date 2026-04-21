import type { APIRoute } from 'astro';
import { queryFirst, queryAll } from '@/lib/db';

export const GET: APIRoute = async ({ locals, params }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  const id = params.id;

  const [match, events, evals] = await Promise.all([
    queryFirst<any>(db, `SELECT * FROM matches WHERE id=? AND club_id=?`, [id, locals.user.club_id]),
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
