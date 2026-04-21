import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, params, redirect }) => {
  const user = locals.user;
  if (!user || !['FEDERATION_ADMIN','SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const { id } = params;
  const form = await request.formData();
  const status = form.get('status') as string;
  const response_notes = (form.get('response_notes') as string)?.trim() ?? '';

  const validStatuses = ['IN_REVIEW','INFO_NEEDED','APPROVED','REJECTED'];
  if (!validStatuses.includes(status)) return redirect(`/federatie-admin/cereri/${id}?err=status`);

  const resolved_at = ['APPROVED','REJECTED'].includes(status) ? 'CURRENT_TIMESTAMP' : 'NULL';

  await execute(db,
    `UPDATE federation_requests
     SET status = ?, response_notes = ?, updated_at = CURRENT_TIMESTAMP,
         resolved_at = ${resolved_at === 'CURRENT_TIMESTAMP' ? 'CURRENT_TIMESTAMP' : 'NULL'}
     WHERE id = ?`,
    [status, response_notes, id]);

  // Auto-create legitimation on APPROVED LEGITIMARE request
  if (status === 'APPROVED') {
    const cerere = await queryFirst<any>(db,
      'SELECT * FROM federation_requests WHERE id = ?', [id]);
    if (cerere?.request_type === 'LEGITIMARE' && cerere.player_id && cerere.club_id) {
      const year = new Date().getFullYear();
      const sport = cerere.sport_code ?? 'BASEBALL5';
      const sportCode3 = sport === 'BASEBALL5' ? 'B5' : 'SFT';
      const seq = await queryFirst<any>(db,
        `SELECT COALESCE(MAX(CAST(SUBSTR(license_number, 14) AS INTEGER)), 0) + 1 AS next
         FROM player_legitimations WHERE sport_code = ? AND license_number LIKE ?`,
        [sport, `FRBS-${year}-${sportCode3}-%`]);
      const licenseNumber = `FRBS-${year}-${sportCode3}-${String(seq?.next ?? 1).padStart(6, '0')}`;

      await execute(db,
        `INSERT OR IGNORE INTO player_legitimations
         (id, player_id, club_id, sport_code, registration_type, license_number, status, issued_by)
         VALUES (?, ?, ?, ?, 'INITIAL', ?, 'ACTIVE', ?)`,
        [crypto.randomUUID(), cerere.player_id, cerere.club_id, sport, licenseNumber, user.id]);
      await execute(db,
        `UPDATE players SET legitimation_status='LEGITIMAT', license_number=? WHERE id=?`,
        [licenseNumber, cerere.player_id]);
    }
  }

  return redirect(`/federatie-admin/cereri/${id}?msg=actualizat`);
};
