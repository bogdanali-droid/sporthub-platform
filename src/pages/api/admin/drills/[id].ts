import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals, params }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const env = (locals as any).runtime?.env;
  const row = await queryFirst(env.DB,
    `SELECT * FROM drills WHERE id=? AND is_active=1 AND (club_id=? OR club_id IS NULL)`,
    [params.id, locals.user.club_id]);
  if (!row) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(row), { headers: { 'Content-Type': 'application/json' } });
};

export const PUT: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const b = await request.json() as any;
  const existing = await queryFirst(env.DB,
    `SELECT id FROM drills WHERE id=? AND club_id=? AND is_active=1`,
    [params.id, locals.user.club_id]);
  if (!existing) return new Response(JSON.stringify({ error: 'Not found or not editable' }), { status: 404 });
  await execute(env.DB,
    `UPDATE drills SET title=?, description=?, category=?, difficulty=?, duration_minutes=? WHERE id=?`,
    [b.title, b.description || null, b.category || null, b.difficulty || null,
     b.duration_minutes ? Number(b.duration_minutes) : null, params.id]);
  return new Response(JSON.stringify({ ok: true }));
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const existing = await queryFirst(env.DB,
    `SELECT id FROM drills WHERE id=? AND club_id=? AND is_active=1`,
    [params.id, locals.user.club_id]);
  if (!existing) return new Response(JSON.stringify({ error: 'Not found or not deletable' }), { status: 404 });
  await execute(env.DB, `UPDATE drills SET is_active=0 WHERE id=?`, [params.id]);
  return new Response(JSON.stringify({ ok: true }));
};
