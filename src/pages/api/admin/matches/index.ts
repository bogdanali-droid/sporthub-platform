import type { APIRoute } from 'astro';
import { queryAll, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const env = (locals as any).runtime?.env;
  const rows = await queryAll(env.DB,
    `SELECT m.*, t.name AS team_name FROM matches m
     JOIN teams t ON t.id = m.team_id
     WHERE m.club_id = ? ORDER BY m.match_date DESC`,
    [locals.clubId]);
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const b = await request.json() as any;
  if (!b.team_id || !b.opponent_name || !b.match_date)
    return new Response(JSON.stringify({ error: 'Echipă, adversar și dată obligatorii' }), { status: 400 });
  await execute(env.DB,
    `INSERT INTO matches (club_id, team_id, opponent_name, match_date, location, is_home, competition, score_home, score_away, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [locals.clubId, b.team_id, b.opponent_name, b.match_date,
     b.location||null, b.is_home ?? 1, b.competition||null,
     b.score_home ?? null, b.score_away ?? null, b.status||'SCHEDULED']);
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
};
