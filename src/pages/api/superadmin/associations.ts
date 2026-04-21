import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = (locals as any).user;
  if (!user || user.role !== 'SUPERADMIN') return new Response('Unauthorized', { status: 401 });

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();
  const name = (form.get('name') as string)?.trim();
  const federation_id = (form.get('federation_id') as string)?.trim();

  if (!name || !federation_id) return redirect('/superadmin/associations?err=date');

  const fed = await db.prepare('SELECT id FROM federations WHERE id = ?').bind(federation_id).first();
  if (!fed) return redirect('/superadmin/associations?err=fed');

  try {
    await db.prepare(
      'INSERT INTO associations (federation_id, name, acronym, region, email, phone) VALUES (?,?,?,?,?,?)'
    ).bind(
      federation_id,
      name,
      (form.get('acronym') as string)?.trim() || null,
      (form.get('region') as string)?.trim() || null,
      (form.get('email') as string)?.trim() || null,
      (form.get('phone') as string)?.trim() || null
    ).run();
    return redirect('/superadmin/associations?msg=creat');
  } catch {
    return redirect('/superadmin/associations?err=eroare');
  }
};
