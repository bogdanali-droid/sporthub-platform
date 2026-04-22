import type { APIRoute } from 'astro';
import { queryFirst, queryAll, execute } from '@/lib/db';

export const POST: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const clubId = (locals as any).clubId ?? locals.user?.club_id;
  const id = params.id;
  const body = await request.json() as any;

  const match = await queryFirst<any>(db, `SELECT * FROM matches WHERE id=? AND club_id=?`, [id, clubId]);
  if (!match) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  await execute(db,
    `INSERT INTO match_events (match_id, club_id, period, event_type, team, player_id, player_name, points, description, created_by, inning, half)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, clubId, body.period ?? null, body.event_type, body.team ?? 'HOME',
     body.player_id ?? null, body.player_name ?? null, body.points ?? 0,
     body.description ?? null, locals.user.id, body.inning ?? null, body.half ?? null]);

  // Check mercy rule for Baseball5 (15+ runs after 3 innings, 10+ after 4)
  const events = await queryAll<any>(db,
    `SELECT * FROM match_events WHERE match_id=? ORDER BY created_at DESC LIMIT 50`, [id]);

  const updated = await queryFirst<any>(db, `SELECT * FROM matches WHERE id=?`, [id]);
  let mercyTriggered = false;

  if (match.sport_code === 'BASEBALL5' && updated) {
    const scoreHome = updated.score_home || 0;
    const scoreAway = updated.score_away || 0;
    const runDiff = Math.abs(scoreHome - scoreAway);
    const currentInning = updated.current_inning || 1;

    // Mercy rule: 15+ runs after 3 innings, 10+ after 4
    if ((currentInning > 3 && runDiff >= 15) || (currentInning > 4 && runDiff >= 10)) {
      mercyTriggered = true;
      await execute(db,
        `UPDATE matches SET status='FINISHED', finished_at=CURRENT_TIMESTAMP WHERE id=?`,
        [id]);
    }
  }

  return new Response(JSON.stringify({ ok: true, mercyTriggered, events }), { status: 201 });
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
