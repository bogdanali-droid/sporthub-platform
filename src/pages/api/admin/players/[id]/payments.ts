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
  const payId = 'pay' + Date.now() + Math.random().toString(36).slice(2, 6);

  await execute(db, `
    INSERT INTO payments
      (id, club_id, player_id, amount, currency, description, due_date, status, method, reference, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    payId, session.clubId, id,
    body.amount, body.currency ?? 'RON',
    body.description ?? null, body.due_date ?? null,
    body.status ?? 'PENDING', body.method ?? null,
    body.reference ?? null, session.userId
  ]);

  return new Response(JSON.stringify({ ok: true, id: payId }), { headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE({ request, locals }: APIContext) {
  const session = locals.session;
  if (!session) return new Response('Unauthorized', { status: 401 });
  const db = locals.db as D1Database;
  const body = await request.json() as any;
  await execute(db, 'DELETE FROM payments WHERE id = ? AND club_id = ?', [body.payment_id, session.clubId]);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
