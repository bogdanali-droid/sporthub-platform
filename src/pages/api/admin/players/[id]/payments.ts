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
  const payId = 'pay' + Date.now() + Math.random().toString(36).slice(2, 6);

  await execute(db, `
    INSERT INTO payments
      (id, club_id, player_id, amount, currency, description, due_date, status, method, reference, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    payId, locals.user?.club_id, id,
    body.amount, body.currency ?? 'RON',
    body.description ?? null, body.due_date ?? null,
    body.status ?? 'PENDING', body.method ?? null,
    body.reference ?? null, locals.user?.id
  ]);

  return new Response(JSON.stringify({ ok: true, id: payId }), { headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE({ request, locals }: APIContext) {
  const session = { user: locals.user, clubId: locals.user?.club_id };
  if (!session) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  const body = await request.json() as any;
  await execute(db, 'DELETE FROM payments WHERE id = ? AND club_id = ?', [body.payment_id, locals.user?.club_id]);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
