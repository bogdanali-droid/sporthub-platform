import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, params, redirect }) => {
  const user = locals.user;
  if (!user || !user.club_id) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const db = (locals as any).runtime?.env?.DB;
  const { id } = params;

  const cerere = await queryFirst<any>(db,
    'SELECT id, status FROM federation_requests WHERE id = ? AND club_id = ?',
    [id, user.club_id]);
  if (!cerere) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  if (['APPROVED','REJECTED'].includes(cerere.status)) return redirect(`/admin/federatie/cereri/${id}?err=closed`);

  const form = await request.formData();
  const message = (form.get('message') as string)?.trim();
  if (!message) return redirect(`/admin/federatie/cereri/${id}?err=gol`);

  await execute(db,
    `INSERT INTO federation_request_messages (id, request_id, sender_id, sender_role, message)
     VALUES (?, ?, ?, 'CLUB', ?)`,
    [crypto.randomUUID(), id, user.id, message]);

  await execute(db,
    `UPDATE federation_requests SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [id]);

  return redirect(`/admin/federatie/cereri/${id}?msg=trimis`);
};
