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

  const leg = await queryFirst<any>(db, 'SELECT * FROM player_legitimations WHERE id = ?', [id]);
  if (!leg) return redirect('/federatie-admin/legitimari?err=negasit');

  await execute(db, `UPDATE player_legitimations SET status='SUSPENDED' WHERE id=?`, [id]);
  await execute(db, `UPDATE players SET legitimation_status='SUSPENDAT' WHERE id=?`, [leg.player_id]);

  return redirect('/federatie-admin/legitimari?msg=suspendat');
};
