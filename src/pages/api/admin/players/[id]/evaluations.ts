import type { APIContext } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const prerender = false;

export async function POST({ params, request, locals }: APIContext) {
  const session = { user: locals.user, clubId: locals.user?.club_id };
  if (!session) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  const { id } = params;

  const player = await queryFirst<any>(db,
    'SELECT id FROM players WHERE id = ? AND club_id = ?', [id, locals.user?.club_id]
  );
  if (!player) return new Response('Not found', { status: 404 });

  const body = await request.json() as any;
  const { eval_date, season, notes, scores } = body;

  const scoreValues = Object.values(scores || {}) as number[];
  const overall = scoreValues.length > 0
    ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length
    : null;

  const evalId = 'ev' + Date.now() + Math.random().toString(36).slice(2, 6);

  await execute(db, `
    INSERT INTO player_evaluations
      (id, player_id, club_id, evaluated_by, eval_date, season, overall_score, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [evalId, id, locals.user?.club_id, locals.user?.id, eval_date, season ?? null, overall, notes ?? null]);

  for (const [code, score] of Object.entries(scores || {})) {
    const scoreId = 'sc' + Date.now() + Math.random().toString(36).slice(2, 6);
    await execute(db, `
      INSERT OR REPLACE INTO player_evaluation_scores (id, evaluation_id, attribute_code, score)
      VALUES (?, ?, ?, ?)
    `, [scoreId, evalId, code, score as number]);
  }

  return new Response(JSON.stringify({ ok: true, id: evalId }), { headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE({ request, locals }: APIContext) {
  const session = { user: locals.user, clubId: locals.user?.club_id };
  if (!session) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  const body = await request.json() as any;
  await execute(db,
    'DELETE FROM player_evaluations WHERE id = ? AND club_id = ?',
    [body.eval_id, locals.user?.club_id]
  );
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
