import type { APIRoute } from 'astro';
import { queryAll, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const env = (locals as any).runtime?.env;
  const rows = await queryAll(env.DB,
    `SELECT tr.*, t.name AS team_name FROM trainings tr
     JOIN teams t ON t.id = tr.team_id
     WHERE tr.club_id = ? ORDER BY tr.start_time DESC LIMIT 100`,
    [locals.clubId]);
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user || !['ADMIN','COACH','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const b = await request.json() as any;
  if (!b.title || !b.team_id || !b.start_time)
    return new Response(JSON.stringify({ error: 'Titlu, echipă și dată obligatorii' }), { status: 400 });
  await execute(env.DB,
    `INSERT INTO trainings (club_id, team_id, coach_id, title, start_time, end_time, location, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [locals.clubId, b.team_id, locals.user.id, b.title, b.start_time,
     b.end_time||null, b.location||null, b.notes||null, b.status||'SCHEDULED']);
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
};
