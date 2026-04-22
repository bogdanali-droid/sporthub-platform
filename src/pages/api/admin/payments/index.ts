import type { APIRoute } from 'astro';
import { queryAll, execute, queryFirst } from '@/lib/db';

export const GET: APIRoute = async ({ locals, url }) => {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });

  const env = (locals as any).runtime?.env;
  const db = env?.DB as D1Database;
  if (!db) return new Response('Database unavailable', { status: 500 });

  const clubId = locals.user.club_id;
  const status = url.searchParams.get('status');
  const playerId = url.searchParams.get('playerId');

  let query = `SELECT p.*, pl.first_name, pl.last_name
               FROM payments p
               LEFT JOIN players pl ON pl.id = p.player_id
               WHERE p.club_id = ?`;
  let params: any[] = [clubId];

  if (status) {
    query += ` AND p.status = ?`;
    params.push(status);
  }

  if (playerId) {
    query += ` AND p.player_id = ?`;
    params.push(playerId);
  }

  query += ` ORDER BY p.due_date ASC LIMIT 100`;

  const rows = await queryAll(db, query, params);
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || !['ADMIN', 'COACH', 'SUPERADMIN'].includes(locals.user.role)) {
    return new Response('Forbidden', { status: 403 });
  }

  const env = (locals as any).runtime?.env;
  const db = env?.DB as D1Database;
  if (!db) return new Response('Database unavailable', { status: 500 });

  const clubId = locals.user.club_id;
  const body = await request.json().catch(() => null);
  if (!body) return new Response('Invalid JSON', { status: 400 });

  const { player_id, amount, currency, description, method, reference, due_date } = body;

  if (!player_id || !amount || !description) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const id = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b: number) => b.toString(16).padStart(2, '0')).join('');
  await execute(
    db,
    `INSERT INTO payments (id, club_id, player_id, amount, currency, description, payment_method, reference, due_date, created_by, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
    [
      id,
      clubId,
      player_id,
      amount,
      currency ?? 'RON',
      description ?? null,
      method ?? null,
      reference ?? null,
      due_date ?? null,
      locals.user.id,
    ]
  );

  const row = await queryFirst(db, 'SELECT * FROM payments WHERE id = ?', [id]);
  return new Response(JSON.stringify(row), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
