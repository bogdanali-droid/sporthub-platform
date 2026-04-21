import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || !['FEDERATION_ADMIN','SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();

  const player_id      = (form.get('player_id') as string)?.trim();
  const club_id        = (form.get('club_id') as string)?.trim();
  const sport_code     = form.get('sport_code') as string;
  const registration_type = (form.get('registration_type') as string) ?? 'INITIAL';
  const age_group      = (form.get('age_group') as string) ?? 'OPEN';
  const notes          = (form.get('notes') as string) ?? '';

  if (!player_id || !club_id || !sport_code) return redirect('/federatie-admin/legitimari?err=date-lipsa');

  // Check player exists
  const player = await queryFirst<any>(db, 'SELECT id FROM players WHERE id = ?', [player_id]);
  if (!player) return redirect('/federatie-admin/legitimari?err=jucator-negasit');

  // Generate license number: FRBS-YYYY-{B5|SFT}-NNNNNN
  const year = new Date().getFullYear();
  const sportCode3 = sport_code === 'BASEBALL5' ? 'B5' : 'SFT';
  const seq = await queryFirst<any>(db,
    `SELECT COALESCE(MAX(CAST(SUBSTR(license_number, 14) AS INTEGER)), 0) + 1 AS next
     FROM player_legitimations WHERE sport_code = ? AND license_number LIKE ?`,
    [sport_code, `FRBS-${year}-${sportCode3}-%`]);
  const licenseNumber = `FRBS-${year}-${sportCode3}-${String(seq?.next ?? 1).padStart(6, '0')}`;

  const id = crypto.randomUUID();
  await execute(db,
    `INSERT INTO player_legitimations
     (id, player_id, club_id, sport_code, age_group, registration_type, license_number, status, issued_by, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)`,
    [id, player_id, club_id, sport_code, age_group, registration_type, licenseNumber, user.id, notes]);

  // Update player legitimation status
  await execute(db,
    `UPDATE players SET legitimation_status = 'LEGITIMAT', license_number = ? WHERE id = ?`,
    [licenseNumber, player_id]);

  return redirect('/federatie-admin/legitimari?msg=creat');
};
