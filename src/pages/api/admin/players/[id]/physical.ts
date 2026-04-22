export const prerender = false;
import type { APIRoute } from 'astro';
import { queryAll, queryFirst, execute } from '@/lib/db';

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.user || !['ADMIN', 'SUPERADMIN', 'COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const clubId = locals.user.club_id;
  const playerId = params.id;

  const tests = await queryAll<any>(db,
    `SELECT * FROM physical_tests
     WHERE player_id = ? AND club_id = ?
     ORDER BY test_date DESC`,
    [playerId, clubId]);

  return new Response(JSON.stringify(tests), {
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

  // Store sprint and grip in extra_data JSON
  const extraData = {
    sprint_20m: body.sprint_20m,
    grip_strength_kg: body.grip_strength_kg,
  };

  // Create physical test
  const testId = (await db.prepare(
    `INSERT INTO physical_tests (player_id, club_id, test_date, height_cm, weight_kg, broad_jump, extra_data, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id`
  ).bind(
    playerId, clubId, body.test_date,
    body.height_cm || null, body.weight_kg || null,
    body.broad_jump_cm || null,
    JSON.stringify(extraData),
    body.notes || null
  ).first<any>())?.id;

  if (!testId) return new Response(JSON.stringify({ error: 'Failed to create test' }), { status: 500 });

  return new Response(JSON.stringify({ ok: true, id: testId }), { status: 201 });
};

export const DELETE: APIRoute = async ({ params, locals, request }) => {
  if (!locals.user || !['ADMIN', 'SUPERADMIN', 'COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const clubId = locals.user.club_id;
  const playerId = params.id;
  const body = await request.json() as any;

  // Verify test belongs to player and club
  const test = await queryFirst<any>(db,
    'SELECT id FROM physical_tests WHERE id = ? AND player_id = ? AND club_id = ?',
    [body.test_id, playerId, clubId]);
  if (!test) return new Response(JSON.stringify({ error: 'Test not found' }), { status: 404 });

  // Delete test
  await execute(db, 'DELETE FROM physical_tests WHERE id = ?', [body.test_id]);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
