import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = (locals as any).user;
  if (!user || user.role !== 'SUPERADMIN') return new Response('Unauthorized', { status: 401 });

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();
  const name = (form.get('name') as string)?.trim();
  const sport_code = (form.get('sport_code') as string)?.trim();

  if (!name) return redirect('/superadmin/federations?err=name');

  try {
    await db.prepare(
      'INSERT INTO federations (sport_code, name, acronym, country, website, email) VALUES (?,?,?,?,?,?)'
    ).bind(
      sport_code || null,
      name,
      (form.get('acronym') as string)?.trim() || null,
      (form.get('country') as string)?.trim() || 'RO',
      (form.get('website') as string)?.trim() || null,
      (form.get('email') as string)?.trim() || null
    ).run();
    return redirect('/superadmin/federations?msg=creat');
  } catch {
    return redirect('/superadmin/federations?err=eroare');
  }
};
