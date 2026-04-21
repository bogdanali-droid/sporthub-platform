import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || !['FEDERATION_ADMIN','SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();
  const id = form.get('id') as string;

  const transfer = await queryFirst<any>(db,
    'SELECT * FROM player_transfers WHERE id = ? AND status = ?', [id, 'PENDING']);
  if (!transfer) return redirect('/federatie-admin/transferuri?err=negasit');

  await execute(db,
    `UPDATE player_transfers SET status='APPROVED', approved_by=?, approved_at=CURRENT_TIMESTAMP WHERE id=?`,
    [user.id, id]);

  // Move player to new club
  await execute(db, `UPDATE players SET club_id=? WHERE id=?`, [transfer.to_club_id, transfer.player_id]);

  // Cancel old legitimation, create new one
  await execute(db,
    `UPDATE player_legitimations SET status='CANCELLED' WHERE player_id=? AND club_id=? AND sport_code=? AND status='ACTIVE'`,
    [transfer.player_id, transfer.from_club_id, transfer.sport_code]);

  const year = new Date().getFullYear();
  const sportCode3 = transfer.sport_code === 'BASEBALL5' ? 'B5' : 'SFT';
  const seq = await queryFirst<any>(db,
    `SELECT COALESCE(MAX(CAST(SUBSTR(license_number, 14) AS INTEGER)), 0) + 1 AS next
     FROM player_legitimations WHERE sport_code = ? AND license_number LIKE ?`,
    [transfer.sport_code, `FRBS-${year}-${sportCode3}-%`]);
  const licenseNumber = `FRBS-${year}-${sportCode3}-${String(seq?.next ?? 1).padStart(6, '0')}`;

  await execute(db,
    `INSERT INTO player_legitimations (id, player_id, club_id, sport_code, registration_type, license_number, status, issued_by)
     VALUES (?, ?, ?, ?, 'TRANSFER', ?, 'ACTIVE', ?)`,
    [crypto.randomUUID(), transfer.player_id, transfer.to_club_id, transfer.sport_code, licenseNumber, user.id]);

  await execute(db,
    `UPDATE players SET legitimation_status='LEGITIMAT', license_number=? WHERE id=?`,
    [licenseNumber, transfer.player_id]);

  return redirect('/federatie-admin/transferuri?msg=aprobat');
};
