import type { APIRoute } from 'astro';
import { execute, queryFirst } from '@/lib/db';

export const PUT: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user || !['ADMIN', 'COACH', 'SUPERADMIN'].includes(locals.user.role)) {
    return new Response('Forbidden', { status: 403 });
  }

  const env = (locals as any).runtime?.env;
  const db = env?.DB as D1Database;
  if (!db) return new Response('Database unavailable', { status: 500 });

  const clubId = locals.user.club_id;
  const body = await request.json().catch(() => null);
  if (!body) return new Response('Invalid JSON', { status: 400 });

  // Verify payment belongs to this club
  const existing = await queryFirst(
    db,
    'SELECT id FROM payments WHERE id = ? AND club_id = ?',
    [params.id, clubId]
  );
  if (!existing) return new Response('Not found', { status: 404 });

  const status = body.status;
  if (status && !['PAID', 'PENDING', 'OVERDUE', 'CANCELLED'].includes(status)) {
    return new Response(JSON.stringify({ error: 'Invalid status' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Full edit — when amount or other fields are provided
  if (body.amount !== undefined || body.description !== undefined || body.due_date !== undefined || body.payment_method !== undefined || body.reference !== undefined) {
    const newStatus = status || 'PENDING';
    await execute(
      db,
      `UPDATE payments SET
        amount       = COALESCE(?, amount),
        currency     = COALESCE(?, currency),
        description  = COALESCE(?, description),
        due_date     = ?,
        payment_method = ?,
        reference    = ?,
        status       = ?,
        paid_at      = CASE WHEN ? = 'PAID' THEN COALESCE(paid_at, CURRENT_TIMESTAMP) ELSE NULL END
       WHERE id = ? AND club_id = ?`,
      [
        body.amount   ?? null,
        body.currency ?? null,
        body.description ?? null,
        body.due_date ?? null,
        body.payment_method ?? null,
        body.reference ?? null,
        newStatus,
        newStatus,
        params.id, clubId,
      ]
    );
  } else if (status) {
    // Status-only update (markPaid / cancelPayment)
    if (status === 'PAID') {
      await execute(
        db,
        `UPDATE payments SET status = 'PAID', paid_at = CURRENT_TIMESTAMP WHERE id = ? AND club_id = ?`,
        [params.id, clubId]
      );
    } else {
      await execute(
        db,
        `UPDATE payments SET status = ?, paid_at = NULL WHERE id = ? AND club_id = ?`,
        [status, params.id, clubId]
      );
    }
  }

  const row = await queryFirst(db, 'SELECT * FROM payments WHERE id = ?', [params.id]);
  return new Response(JSON.stringify(row), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user || !['ADMIN', 'COACH', 'SUPERADMIN'].includes(locals.user.role)) {
    return new Response('Forbidden', { status: 403 });
  }

  const env = (locals as any).runtime?.env;
  const db = env?.DB as D1Database;
  if (!db) return new Response('Database unavailable', { status: 500 });

  const clubId = locals.user.club_id;
  await execute(
    db,
    'DELETE FROM payments WHERE id = ? AND club_id = ?',
    [params.id, clubId]
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
