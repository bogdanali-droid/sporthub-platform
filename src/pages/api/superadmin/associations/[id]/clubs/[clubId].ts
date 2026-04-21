import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ locals, params, redirect }) => {
  const user = (locals as any).user;
  if (!user || user.role !== 'SUPERADMIN') return new Response('Unauthorized', { status: 401 });

  const db = (locals as any).runtime?.env?.DB;
  const { id, clubId } = params;

  try {
    await db.prepare('UPDATE clubs SET association_id = NULL WHERE id = ? AND association_id = ?').bind(clubId, id).run();
    return redirect(`/superadmin/associations/${id}?msg=eliminat`);
  } catch {
    return redirect(`/superadmin/associations/${id}?err=eroare`);
  }
};
