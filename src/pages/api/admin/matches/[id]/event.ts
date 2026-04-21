import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const POST: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const id = params.id;
  const body = await request.json() as any;

  const match = await queryFirst<any>(db, `SELECT id FROM matches WHERE id=? AND club_id=?`, [id, locals.user.club_id]);
  if (!match) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  await execute(db,
    `INSERT INTO match_events (match_id, club_id, period, event_type, team, player_id, player_name, points, description, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, locals.user.club_id, body.period ?? null, body.event_type, body.team ?? 'HOME',
     body.player_id ?? null, body.player_name ?? null, body.points ?? 0,
     body.description ?? null, locals.user.id]);

  return new Response(JSON.stringify({ ok: true }), { status: 201 });
};

export const GET: APIRoute = async ({ locals, params }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const db = (locals as any).runtime?.env?.DB;

  const { queryAll } = await import('@/lib/db');
  const events = await queryAll<any>(db,
    `SELECT me.*, p.first_name || ' ' || p.last_name AS player_name
     FROM match_events me LEFT JOIN players p ON p.id = me.player_id
     WHERE me.match_id=? ORDER BY me.created_at DESC`, [params.id]);

  return new Response(JSON.stringify(events), { headers: { 'Content-Type': 'application/json' } });
};
