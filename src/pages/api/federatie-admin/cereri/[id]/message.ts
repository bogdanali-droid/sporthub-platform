import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, params, redirect }) => {
  const user = locals.user;
  if (!user || !['FEDERATION_ADMIN','SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const { id } = params;

  const cerere = await queryFirst<any>(db, 'SELECT id, status FROM federation_requests WHERE id = ?', [id]);
  if (!cerere) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  const form = await request.formData();
  const message = (form.get('message') as string)?.trim();
  if (!message) return redirect(`/federatie-admin/cereri/${id}?err=gol`);

  await execute(db,
    `INSERT INTO federation_request_messages (id, request_id, sender_id, sender_role, message)
     VALUES (?, ?, ?, 'FEDERATION', ?)`,
    [crypto.randomUUID(), id, user.id, message]);

  await execute(db,
    `UPDATE federation_requests SET updated_at = CURRENT_TIMESTAMP, status = CASE WHEN status = 'PENDING' THEN 'IN_REVIEW' ELSE status END WHERE id = ?`,
    [id]);

  return redirect(`/federatie-admin/cereri/${id}?msg=trimis`);
};
