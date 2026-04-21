import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });
  if (!['ASSOCIATION_ADMIN','FEDERATION_ADMIN','SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  let body: any;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400 });
  }

  const { club_id, is_active } = body ?? {};
  if (!club_id || is_active === undefined) {
    return new Response(JSON.stringify({ ok: false, error: 'club_id and is_active required' }), { status: 400 });
  }

  const club = await queryFirst<any>(db,
    'SELECT id FROM clubs WHERE id=? AND association_id=?',
    [club_id, user.association_id]);

  if (!club) {
    return new Response(JSON.stringify({ ok: false, error: 'Club not found or not in your association' }), { status: 404 });
  }

  await execute(db, 'UPDATE clubs SET is_active=? WHERE id=? AND association_id=?',
    [is_active ? 1 : 0, club_id, user.association_id]);

  return new Response(JSON.stringify({ ok: true, is_active: is_active ? 1 : 0 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
