import type { APIRoute } from 'astro';
import { queryAll, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const env = (locals as any).runtime?.env;
  const rows = await queryAll(env.DB,
    `SELECT * FROM drills WHERE (club_id=? OR club_id IS NULL) AND is_active=1 ORDER BY created_at DESC`,
    [locals.user.club_id]);
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const b = await request.json() as any;
  if (!b.title || !b.sport_code)
    return new Response(JSON.stringify({ error: 'Titlul și sportul sunt obligatorii' }), { status: 400 });
  await execute(env.DB,
    `INSERT INTO drills (title, description, category, difficulty, duration_minutes, sport_code, club_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [b.title, b.description || null, b.category || null, b.difficulty || null,
     b.duration_minutes ? Number(b.duration_minutes) : null,
     b.sport_code, locals.user.club_id, locals.user.id]);
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
};
