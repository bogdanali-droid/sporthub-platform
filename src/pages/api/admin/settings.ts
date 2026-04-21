import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = (locals as any).user;
  if (!user || !user.club_id) return new Response('Unauthorized', { status: 401 });

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();

  try {
    await db.prepare(`
      UPDATE clubs SET name=?, city=?, email=?, phone=?, website=?, address=?, club_motto=?,
        facebook_url=?, instagram_url=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).bind(
      form.get('name'), form.get('city') || null, form.get('email') || null,
      form.get('phone') || null, form.get('website') || null, form.get('address') || null,
      form.get('club_motto') || null, form.get('facebook_url') || null,
      form.get('instagram_url') || null, user.club_id
    ).run();
    return redirect('/admin/settings?msg=salvat');
  } catch {
    return redirect('/admin/settings?err=1');
  }
};
