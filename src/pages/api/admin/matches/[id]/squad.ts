import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

async function checkMatchAccess(locals: any, matchId: string) {
  const env = (locals as any).runtime?.env;
  const match = await queryFirst(env.DB, `SELECT id FROM matches WHERE id=? AND club_id=?`, [matchId, locals.user?.club_id]);
  return { env, match };
}

export const POST: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const { env, match } = await checkMatchAccess(locals, params.id!);
  if (!match) return new Response(JSON.stringify({ error: 'Meci negăsit' }), { status: 404 });
  const b = await request.json() as any;
  if (!b.player_id) return new Response(JSON.stringify({ error: 'player_id obligatoriu' }), { status: 400 });
  await execute(env.DB,
    `INSERT INTO match_selections (match_id, player_id, role, position_played, notes)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(match_id, player_id) DO UPDATE SET
       role=excluded.role, position_played=excluded.position_played, notes=excluded.notes`,
    [params.id, b.player_id, b.role || 'STARTER', b.position_played || null, b.notes || null]);
  return new Response(JSON.stringify({ ok: true }), { status: 201 });
};

export const DELETE: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  const { env, match } = await checkMatchAccess(locals, params.id!);
  if (!match) return new Response(JSON.stringify({ error: 'Meci negăsit' }), { status: 404 });
  const b = await request.json() as any;
  if (!b.player_id) return new Response(JSON.stringify({ error: 'player_id obligatoriu' }), { status: 400 });
  await execute(env.DB,
    `DELETE FROM match_selections WHERE match_id=? AND player_id=?`,
    [params.id, b.player_id]);
  return new Response(JSON.stringify({ ok: true }));
};
