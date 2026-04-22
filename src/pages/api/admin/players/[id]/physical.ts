export const prerender = false;
import type { APIContext } from 'astro';

export async function GET({ params, locals }: APIContext) {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  const clubId = (locals as any).clubId ?? locals.user?.club_id;
  const playerId = params.id!;

  const { results } = await db.prepare(
    `SELECT * FROM physical_tests WHERE player_id = ? AND club_id = ? ORDER BY test_date DESC`
  ).bind(playerId, clubId).all();

  const tests = (results ?? []).map((t: any) => {
    const extra = t.extra_data ? JSON.parse(t.extra_data) : {};
    return { ...t, ...extra };
  });

  return Response.json(tests);
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
  if (!body.test_date) return Response.json({ error: 'test_date required' }, { status: 400 });

  // Baseball5-specific extra fields stored in extra_data JSON
  const extra: Record<string, any> = {};
  if (body.sprint_20m != null) extra.sprint_20m = body.sprint_20m;
  if (body.grip_strength_kg != null) extra.grip_strength_kg = body.grip_strength_kg;

  const testId = 'pt' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  await db.prepare(
    `INSERT INTO physical_tests
       (id, player_id, club_id, test_date, height_cm, weight_kg,
        broad_jump, notes, extra_data, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    testId, playerId, clubId, body.test_date,
    body.height_cm ?? null, body.weight_kg ?? null,
    body.broad_jump_cm ?? body.broad_jump ?? null,
    body.notes ?? null,
    Object.keys(extra).length > 0 ? JSON.stringify(extra) : null,
    locals.user.id
  ).run();

  return Response.json({ ok: true, id: testId });
}

export async function DELETE({ request, params, locals }: APIContext) {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  const clubId = (locals as any).clubId ?? locals.user?.club_id;

  const body = await request.json().catch(() => null) as any;
  if (!body?.test_id) return Response.json({ error: 'test_id required' }, { status: 400 });

  await db.prepare(
    'DELETE FROM physical_tests WHERE id = ? AND club_id = ?'
  ).bind(body.test_id, clubId).run();

  return Response.json({ ok: true });
}
