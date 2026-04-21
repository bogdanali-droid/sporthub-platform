import type { APIRoute } from 'astro';
import { execute } from '@/lib/db';

export const POST: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const { status } = await request.json() as any;

  if (!['SCHEDULED','LIVE','FINISHED','CANCELLED'].includes(status))
    return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 });

  await execute(db,
    `UPDATE matches SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND club_id=?`,
    [status, params.id, locals.user.club_id]);

  return new Response(JSON.stringify({ ok: true }));
};
