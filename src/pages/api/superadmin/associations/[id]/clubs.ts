import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, params, redirect }) => {
  const user = (locals as any).user;
  if (!user || user.role !== 'SUPERADMIN') return new Response('Unauthorized', { status: 401 });

  const db = (locals as any).runtime?.env?.DB;
  const { id } = params;
  const form = await request.formData();
  const club_id = (form.get('club_id') as string)?.trim();

  if (!club_id) return redirect(`/superadmin/associations/${id}?err=club`);

  try {
    await db.prepare('UPDATE clubs SET association_id = ? WHERE id = ?').bind(id, club_id).run();
    return redirect(`/superadmin/associations/${id}?msg=asignat`);
  } catch {
    return redirect(`/superadmin/associations/${id}?err=eroare`);
  }
};
