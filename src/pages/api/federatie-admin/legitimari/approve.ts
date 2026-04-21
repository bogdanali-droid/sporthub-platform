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

  const leg = await queryFirst<any>(db,
    'SELECT * FROM player_legitimations WHERE id = ? AND status = ?', [id, 'PENDING']);
  if (!leg) return redirect('/federatie-admin/legitimari?err=negasit');

  const year = new Date().getFullYear();
  const sportCode3 = leg.sport_code === 'BASEBALL5' ? 'B5' : 'SFT';
  const seq = await queryFirst<any>(db,
    `SELECT COALESCE(MAX(CAST(SUBSTR(license_number, 14) AS INTEGER)), 0) + 1 AS next
     FROM player_legitimations WHERE sport_code = ? AND license_number LIKE ? AND status = 'ACTIVE'`,
    [leg.sport_code, `FRBS-${year}-${sportCode3}-%`]);
  const licenseNumber = leg.license_number ?? `FRBS-${year}-${sportCode3}-${String(seq?.next ?? 1).padStart(6, '0')}`;

  await execute(db,
    `UPDATE player_legitimations SET status='ACTIVE', license_number=?, issued_by=?, issued_at=CURRENT_TIMESTAMP WHERE id=?`,
    [licenseNumber, user.id, id]);
  await execute(db,
    `UPDATE players SET legitimation_status='LEGITIMAT', license_number=? WHERE id=?`,
    [licenseNumber, leg.player_id]);

  return redirect('/federatie-admin/legitimari?msg=aprobat');
};
