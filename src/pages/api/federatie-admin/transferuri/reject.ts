import type { APIRoute } from 'astro';
import { execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || !['FEDERATION_ADMIN','SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();
  const id = form.get('id') as string;

  await execute(db,
    `UPDATE player_transfers SET status='REJECTED', approved_by=?, approved_at=CURRENT_TIMESTAMP WHERE id=? AND status='PENDING'`,
    [user.id, id]);

  return redirect('/federatie-admin/transferuri?msg=respins');
};
