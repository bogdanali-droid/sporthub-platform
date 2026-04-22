export const prerender = false;
import type { APIContext } from 'astro';

export async function GET({ params, locals }: APIContext) {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  const clubId = (locals as any).clubId ?? locals.user?.club_id;
  const playerId = params.id!;

  const { results: evals } = await db.prepare(
    `SELECT pe.*, u.first_name || ' ' || u.last_name AS evaluator_name
     FROM player_evaluations pe
     LEFT JOIN users u ON u.id = pe.evaluated_by
     WHERE pe.player_id = ? AND pe.club_id = ?
     ORDER BY pe.eval_date DESC`
  ).bind(playerId, clubId).all();

  const evalsList = evals ?? [];
  for (const ev of evalsList as any[]) {
    const { results: scores } = await db.prepare(
      'SELECT attribute_code, score FROM player_evaluation_scores WHERE evaluation_id = ?'
    ).bind(ev.id).all();
    ev.scores = Object.fromEntries((scores ?? []).map((s: any) => [s.attribute_code, s.score]));
  }

  return Response.json(evalsList);
}

export async function POST({ params, request, locals }: APIContext) {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  const clubId = (locals as any).clubId ?? locals.user?.club_id;
  const playerId = params.id!;

  const player = await db.prepare(
    'SELECT id FROM players WHERE id = ? AND club_id = ?'
  ).bind(playerId, clubId).first();
  if (!player) return Response.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json().catch(() => null) as any;
  if (!body) return Response.json({ error: 'Invalid JSON' }, { status: 400 });

  const { eval_date, season, notes, scores } = body;
  if (!eval_date) return Response.json({ error: 'eval_date required' }, { status: 400 });

  const scoreValues = Object.values(scores || {}) as number[];
  const overall = scoreValues.length > 0
    ? Math.round((scoreValues.reduce((a: number, b: number) => a + b, 0) / scoreValues.length) * 10) / 10
    : null;

  const evalId = 'ev' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  await db.prepare(
    `INSERT INTO player_evaluations (id, player_id, club_id, evaluated_by, eval_date, season, overall_score, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(evalId, playerId, clubId, locals.user.id, eval_date, season ?? null, overall, notes ?? null).run();

  for (const [code, score] of Object.entries(scores || {})) {
    const scoreId = 'sc' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    await db.prepare(
      `INSERT OR REPLACE INTO player_evaluation_scores (id, evaluation_id, attribute_code, score)
       VALUES (?, ?, ?, ?)`
    ).bind(scoreId, evalId, code, score as number).run();
  }

  return Response.json({ ok: true, id: evalId });
}

export async function DELETE({ request, params, locals }: APIContext) {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  const clubId = (locals as any).clubId ?? locals.user?.club_id;

  const body = await request.json().catch(() => null) as any;
  if (!body?.eval_id) return Response.json({ error: 'eval_id required' }, { status: 400 });

  await db.prepare(
    'DELETE FROM player_evaluations WHERE id = ? AND club_id = ?'
  ).bind(body.eval_id, clubId).run();

  return Response.json({ ok: true });
}
