import type { APIRoute } from 'astro';
import { queryAll, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const env = (locals as any).runtime?.env;
  const teams = await queryAll(env.DB,
    `SELECT t.*, u.first_name||' '||u.last_name AS coach_name,
            COUNT(tp.player_id) AS player_count
     FROM teams t
     LEFT JOIN users u ON u.id = t.coach_id
     LEFT JOIN team_players tp ON tp.team_id = t.id AND tp.left_at IS NULL
     WHERE t.club_id = ? GROUP BY t.id ORDER BY t.name`,
    [locals.clubId]);
  return new Response(JSON.stringify(teams), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const b = await request.json() as any;
  if (!b.name || !b.age_group)
    return new Response(JSON.stringify({ error: 'Nume și categorie obligatorii' }), { status: 400 });
  await execute(env.DB,
    `INSERT INTO teams (club_id, name, age_group, coach_id, season, jersey_color_primary)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [locals.clubId, b.name, b.age_group, b.coach_id || null, b.season || null, b.jersey_color_primary || '#0f4c81']);
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
};
