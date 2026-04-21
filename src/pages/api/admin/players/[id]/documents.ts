import type { APIContext } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const prerender = false;

export async function POST({ params, request, locals }: APIContext) {
  const session = { user: locals.user, clubId: locals.user?.club_id };
  if (!session) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  const { id } = params;

  const player = await queryFirst<any>(db,
    'SELECT id FROM players WHERE id = ? AND club_id = ?', [id, locals.user?.club_id]
  );
  if (!player) return new Response('Not found', { status: 404 });

  const body = await request.json() as any;
  const docId = 'doc' + Date.now() + Math.random().toString(36).slice(2, 6);

  await execute(db, `
    INSERT INTO player_documents
      (id, player_id, club_id, type, file_url, file_name, mime_type, uploaded_by, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    docId, id, locals.user?.club_id,
    body.type ?? 'OTHER',
    body.file_url, body.file_name,
    body.mime_type ?? null, locals.user?.id,
    body.expires_at ?? null
  ]);

  return new Response(JSON.stringify({ ok: true, id: docId }), { headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE({ request, locals }: APIContext) {
  const session = { user: locals.user, clubId: locals.user?.club_id };
  if (!session) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  const body = await request.json() as any;
  await execute(db, 'DELETE FROM player_documents WHERE id = ? AND club_id = ?', [body.doc_id, locals.user?.club_id]);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
