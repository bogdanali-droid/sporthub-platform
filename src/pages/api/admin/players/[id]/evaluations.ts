export const prerender = false;
import type { APIRoute } from 'astro';
import { queryAll, queryFirst, execute } from '@/lib/db';

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.user || !['ADMIN', 'SUPERADMIN', 'COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const clubId = locals.user.club_id;
  const playerId = params.id;

  const evaluations = await queryAll<any>(db,
    `SELECT pe.*,
            (SELECT GROUP_CONCAT(attribute_code || ':' || score, '|') FROM player_evaluation_scores WHERE evaluation_id = pe.id) AS scores_str
     FROM player_evaluations pe
     WHERE pe.player_id = ? AND pe.club_id = ?
     ORDER BY pe.eval_date DESC`,
    [playerId, clubId]);

  const result = evaluations.map(ev => ({
    ...ev,
    scores: ev.scores_str ? Object.fromEntries(
      ev.scores_str.split('|').map((s: string) => {
        const [k, v] = s.split(':');
        return [k, parseFloat(v)];
      })
    ) : {},
  }));

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ params, locals, request }) => {
  if (!locals.user || !['ADMIN', 'SUPERADMIN', 'COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const clubId = locals.user.club_id;
  const playerId = params.id;
  const body = await request.json() as any;

  // Verify player exists and belongs to club
  const player = await queryFirst<any>(db,
    'SELECT id FROM players WHERE id = ? AND club_id = ?',
    [playerId, clubId]);
  if (!player) return new Response(JSON.stringify({ error: 'Player not found' }), { status: 404 });

  // Create evaluation
  const evalId = (await db.prepare(
    `INSERT INTO player_evaluations (player_id, club_id, eval_date, notes, created_by)
     VALUES (?, ?, ?, ?, ?)
     RETURNING id`
  ).bind(playerId, clubId, body.eval_date, body.notes || null, locals.user.id).first<any>())?.id;

  if (!evalId) return new Response(JSON.stringify({ error: 'Failed to create evaluation' }), { status: 500 });

  // Insert scores
  for (const [attrCode, score] of Object.entries(body.scores || {})) {
    await execute(db,
      `INSERT INTO player_evaluation_scores (evaluation_id, attribute_code, score)
       VALUES (?, ?, ?)`,
      [evalId, attrCode, parseFloat(score as string)]);
  }

  // Calculate overall score (average)
  const scores = Object.values(body.scores || {}) as number[];
  const overallScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  await execute(db,
    'UPDATE player_evaluations SET overall_score = ? WHERE id = ?',
    [parseFloat(overallScore.toFixed(2)), evalId]);

  return new Response(JSON.stringify({ ok: true, id: evalId }), { status: 201 });
};

export const DELETE: APIRoute = async ({ params, locals, request }) => {
  if (!locals.user || !['ADMIN', 'SUPERADMIN', 'COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const clubId = locals.user.club_id;
  const playerId = params.id;
  const body = await request.json() as any;

  // Verify evaluation belongs to player and club
  const evaluation = await queryFirst<any>(db,
    'SELECT id FROM player_evaluations WHERE id = ? AND player_id = ? AND club_id = ?',
    [body.eval_id, playerId, clubId]);
  if (!evaluation) return new Response(JSON.stringify({ error: 'Evaluation not found' }), { status: 404 });

  // Delete scores first
  await execute(db, 'DELETE FROM player_evaluation_scores WHERE evaluation_id = ?', [body.eval_id]);
  // Delete evaluation
  await execute(db, 'DELETE FROM player_evaluations WHERE id = ?', [body.eval_id]);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
