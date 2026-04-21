import type { APIContext } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const prerender = false;

export async function PUT({ params, request, locals }: APIContext) {
  const session = { user: locals.user, clubId: locals.user?.club_id };
  if (!session) return new Response('Unauthorized', { status: 401 });

  const db = (locals as any).runtime?.env?.DB;
  const { id } = params;

  const player = await queryFirst<any>(db,
    'SELECT id FROM players WHERE id = ? AND club_id = ?',
    [id, locals.user?.club_id]
  );
  if (!player) return new Response('Not found', { status: 404 });

  const body = await request.json() as any;
  const {
    first_name, last_name, birth_date, gender, position, jersey_number,
    status, license_number, federation_id, address,
    parent_name, parent_email, parent_phone,
    player_email, player_phone, player_whatsapp,
    guardian2_name, guardian2_email, guardian2_phone,
    emergency_contact, emergency_phone, notes, joined_club_at,
    team_id
  } = body;

  await execute(db, `
    UPDATE players SET
      first_name = ?, last_name = ?, birth_date = ?, gender = ?,
      position = ?, jersey_number = ?, status = ?,
      license_number = ?, federation_id = ?, address = ?,
      parent_name = ?, parent_email = ?, parent_phone = ?,
      player_email = ?, player_phone = ?, player_whatsapp = ?,
      guardian2_name = ?, guardian2_email = ?, guardian2_phone = ?,
      emergency_contact = ?, emergency_phone = ?,
      notes = ?, joined_club_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND club_id = ?
  `, [
    first_name, last_name, birth_date, gender ?? null,
    position ?? null, jersey_number ?? null, status ?? 'ACTIVE',
    license_number ?? null, federation_id ?? null, address ?? null,
    parent_name ?? null, parent_email ?? null, parent_phone ?? null,
    player_email ?? null, player_phone ?? null, player_whatsapp ?? null,
    guardian2_name ?? null, guardian2_email ?? null, guardian2_phone ?? null,
    emergency_contact ?? null, emergency_phone ?? null,
    notes ?? null, joined_club_at ?? null,
    id, locals.user?.club_id
  ]);

  if (team_id !== undefined) {
    await execute(db,
      `UPDATE team_players SET left_at = CURRENT_TIMESTAMP WHERE player_id = ? AND left_at IS NULL`,
      [id]
    );
    if (team_id) {
      const season = new Date().getFullYear().toString();
      await execute(db,
        `INSERT OR IGNORE INTO team_players (team_id, player_id, season) VALUES (?, ?, ?)`,
        [team_id, id, season]
      );
    }
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE({ params, locals }: APIContext) {
  const session = { user: locals.user, clubId: locals.user?.club_id };
  if (!session) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  const { id } = params;
  await execute(db, 'DELETE FROM players WHERE id = ? AND club_id = ?', [id, locals.user?.club_id]);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
