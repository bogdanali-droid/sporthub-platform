import type { APIRoute } from 'astro';
import { execute, queryFirst } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || !['FEDERATION_ADMIN', 'SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();

  const player_id     = (form.get('player_id') as string)?.trim();
  const duration_days = (form.get('duration_days') as string)?.trim();

  if (!player_id) {
    return redirect('/federatie-admin/suspendari?err=date-lipsa');
  }

  const player = await queryFirst<any>(db, 'SELECT id FROM players WHERE id = ?', [player_id]);
  if (!player) return redirect('/federatie-admin/suspendari?err=jucator-negasit');

  await execute(db,
    `UPDATE player_legitimations SET status = 'SUSPENDED' WHERE player_id = ? AND status = 'ACTIVE'`,
    [player_id]);

  await execute(db,
    `UPDATE players SET legitimation_status = 'SUSPENDAT' WHERE id = ?`,
    [player_id]);

  return redirect('/federatie-admin/suspendari?msg=suspendat');
};
