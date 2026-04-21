import type { APIRoute } from 'astro';
import { execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || !['FEDERATION_ADMIN', 'SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();

  const title   = (form.get('title') as string)?.trim();
  const content = (form.get('content') as string)?.trim();
  const type    = (form.get('type') as string) || 'INFO';
  const target  = (form.get('target') as string) || 'ALL';

  if (!title || !content) {
    return redirect('/federatie-admin/anunturi?err=date-lipsa');
  }

  const id = crypto.randomUUID();
  await execute(db,
    `INSERT INTO federation_announcements (id, title, content, type, target, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, title, content, type, target, user.id]);

  return redirect('/federatie-admin/anunturi?msg=creat');
};
