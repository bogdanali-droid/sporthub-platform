import type { APIContext } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const prerender = false;

export async function POST({ params, request, locals }: APIContext) {
  const session = locals.session;
  if (!session) return new Response('Unauthorized', { status: 401 });
  const db = locals.db as D1Database;
  const { id } = params;

  const player = await queryFirst<any>(db,
    'SELECT id FROM players WHERE id = ? AND club_id = ?', [id, session.clubId]
  );
  if (!player) return new Response('Not found', { status: 404 });

  const body = await request.json() as any;
  const visitId = 'mv' + Date.now() + Math.random().toString(36).slice(2, 6);

  await execute(db, `
    INSERT INTO medical_visits
      (id, player_id, club_id, visit_date, valid_until, height_cm, weight_kg,
       grip_strength_left, grip_strength_right, doctor_name, clinic_name, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    visitId, id, session.clubId, body.visit_date, body.valid_until ?? null,
    body.height_cm ?? null, body.weight_kg ?? null,
    body.grip_strength_left ?? null, body.grip_strength_right ?? null,
    body.doctor_name ?? null, body.clinic_name ?? null,
    body.notes ?? null, session.userId
  ]);

  return new Response(JSON.stringify({ ok: true, id: visitId }), { headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE({ request, locals }: APIContext) {
  const session = locals.session;
  if (!session) return new Response('Unauthorized', { status: 401 });
  const db = locals.db as D1Database;
  const body = await request.json() as any;
  await execute(db, 'DELETE FROM medical_visits WHERE id = ? AND club_id = ?', [body.visit_id, session.clubId]);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
