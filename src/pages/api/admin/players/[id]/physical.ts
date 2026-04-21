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
  const testId = 'pt' + Date.now() + Math.random().toString(36).slice(2, 6);

  await execute(db, `
    INSERT INTO physical_tests
      (id, player_id, club_id, test_date, height_cm, weight_kg,
       sprint_10m, sprint_30m, sprint_50m, broad_jump,
       push_ups, pull_ups, yo_yo_test, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    testId, id, locals.user?.club_id, body.test_date,
    body.height_cm ?? null, body.weight_kg ?? null,
    body.sprint_10m ?? null, body.sprint_30m ?? null, body.sprint_50m ?? null,
    body.broad_jump ?? null, body.push_ups ?? null, body.pull_ups ?? null,
    body.yo_yo_test ?? null, body.notes ?? null, locals.user?.id
  ]);

  return new Response(JSON.stringify({ ok: true, id: testId }), { headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE({ request, locals }: APIContext) {
  const session = { user: locals.user, clubId: locals.user?.club_id };
  if (!session) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  const body = await request.json() as any;
  await execute(db, 'DELETE FROM physical_tests WHERE id = ? AND club_id = ?', [body.test_id, locals.user?.club_id]);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
