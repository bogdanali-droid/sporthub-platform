import type { APIRoute } from 'astro';
import { execute } from '@/lib/db';

export const POST: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const body = await request.json() as any;
  // body: { player_id, scores: { attr_code: score, ... } }

  if (!body.player_id || !body.scores)
    return new Response(JSON.stringify({ error: 'player_id and scores required' }), { status: 400 });

  for (const [attr, score] of Object.entries(body.scores)) {
    const s = Number(score);
    if (s < 1 || s > 5) continue;
    await execute(db,
      `INSERT INTO match_eval_scores (match_id, player_id, eval_attr, score, coach_id)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(match_id, player_id, eval_attr) DO UPDATE SET score=excluded.score`,
      [params.id, body.player_id, attr, s, locals.user.id]);
  }

  return new Response(JSON.stringify({ ok: true }));
};
