import type { APIRoute } from 'astro';
import { execute } from '@/lib/db';

export const POST: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const body = await request.json() as any;

  await execute(db,
    `UPDATE matches SET youtube_video_id=?, veo_share_url=?, xbotgo_stream_url=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=? AND club_id=?`,
    [body.youtube_video_id ?? null, body.veo_share_url ?? null, body.xbotgo_stream_url ?? null,
     params.id, locals.user.club_id]);

  return new Response(JSON.stringify({ ok: true }));
};
