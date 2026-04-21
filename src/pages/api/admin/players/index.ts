import type { APIRoute } from 'astro';
import { queryAll, execute } from '@/lib/db';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const env = (locals as any).runtime?.env;
  const players = await queryAll(env.DB,
    `SELECT p.*, t.name AS team_name FROM players p
     LEFT JOIN team_players tp ON tp.player_id = p.id AND tp.left_at IS NULL
     LEFT JOIN teams t ON t.id = tp.team_id
     WHERE p.club_id = ? ORDER BY p.last_name, p.first_name`,
    [locals.clubId]);
  return new Response(JSON.stringify(players), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const env = (locals as any).runtime?.env;
  const b = await request.json() as any;
  if (!b.first_name || !b.last_name || !b.birth_date)
    return new Response(JSON.stringify({ error: 'Câmpuri obligatorii lipsă' }), { status: 400 });

  await execute(env.DB,
    `INSERT INTO players (club_id, first_name, last_name, birth_date, gender, position, jersey_number, status, parent_email, parent_phone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [locals.clubId, b.first_name, b.last_name, b.birth_date,
     b.gender || null, b.position || null, b.jersey_number || null,
     b.status || 'ACTIVE', b.parent_email || null, b.parent_phone || null]);

  if (b.team_id) {
    const player = await queryAll<any>(env.DB,
      `SELECT id FROM players WHERE club_id=? AND first_name=? AND last_name=? ORDER BY created_at DESC LIMIT 1`,
      [locals.clubId, b.first_name, b.last_name]);
    if (player[0]) {
      const season = new Date().getFullYear().toString();
      await execute(env.DB,
        `INSERT OR IGNORE INTO team_players (team_id, player_id, season) VALUES (?, ?, ?)`,
        [b.team_id, player[0].id, season]);
    }
  }
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
};
