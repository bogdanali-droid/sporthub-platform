export const prerender = false;
import type { APIRoute } from 'astro';

// GET: preview - how many payments would be deleted
// POST: execute deletion
export const GET: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user || (user as any).role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const db = (locals as any).runtime?.env?.DB as D1Database | undefined;
  if (!db) return new Response(JSON.stringify({ error: 'db' }), { status: 500 });

  const clubId = user.club_id;
  const url = new URL(request.url);
  const month    = url.searchParams.get('month') || '';    // YYYY-MM
  const teamId   = url.searchParams.get('team_id') || '';
  const descr    = url.searchParams.get('description') || '';
  const statuses = (url.searchParams.get('statuses') || 'PENDING').split(',').filter(Boolean);

  const { sql, params } = buildQuery(clubId, month, teamId, descr, statuses, true);
  const row = await (db as any).prepare(sql).bind(...params).first() as any;

  return new Response(JSON.stringify({ count: row?.cnt ?? 0 }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user || (user as any).role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const db = (locals as any).runtime?.env?.DB as D1Database | undefined;
  if (!db) return new Response(JSON.stringify({ error: 'db' }), { status: 500 });

  const clubId = user.club_id;

  let body: any;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 });
  }

  const month    = body.month    || '';
  const teamId   = body.team_id  || '';
  const descr    = body.description || '';
  const statuses: string[] = body.statuses || ['PENDING'];

  // Safety: never delete PAID payments unless explicitly included
  // (caller must explicitly pass 'PAID' in statuses)
  if (!month && !descr && !teamId) {
    return new Response(JSON.stringify({ error: 'Trebuie specificat cel puțin luna sau descrierea' }), { status: 400 });
  }

  const { sql, params } = buildQuery(clubId, month, teamId, descr, statuses, false);
  const result = await (db as any).prepare(sql).bind(...params).run();

  return new Response(JSON.stringify({ ok: true, deleted: result?.changes ?? 0 }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

function buildQuery(
  clubId: string, month: string, teamId: string,
  descr: string, statuses: string[], countOnly: boolean
) {
  const params: any[] = [clubId];
  let conditions = 'pay.club_id = ?';

  if (statuses.length > 0) {
    const ph = statuses.map(() => '?').join(',');
    conditions += ` AND pay.status IN (${ph})`;
    params.push(...statuses);
  }
  if (month) {
    conditions += ` AND strftime('%Y-%m', pay.due_date) = ?`;
    params.push(month);
  }
  if (descr) {
    conditions += ` AND pay.description LIKE ?`;
    params.push(`%${descr}%`);
  }

  let sql: string;
  if (countOnly) {
    if (teamId) {
      sql = `SELECT COUNT(*) as cnt FROM payments pay
             LEFT JOIN team_players tp ON tp.player_id = pay.player_id AND tp.left_at IS NULL
             WHERE ${conditions} AND tp.team_id = ?`;
      params.push(teamId);
    } else {
      sql = `SELECT COUNT(*) as cnt FROM payments pay WHERE ${conditions}`;
    }
  } else {
    if (teamId) {
      sql = `DELETE FROM payments WHERE id IN (
               SELECT pay.id FROM payments pay
               LEFT JOIN team_players tp ON tp.player_id = pay.player_id AND tp.left_at IS NULL
               WHERE ${conditions} AND tp.team_id = ?
             )`;
      params.push(teamId);
    } else {
      // SQLite doesn't support table aliases in DELETE — use subquery
      sql = `DELETE FROM payments WHERE id IN (
               SELECT pay.id FROM payments pay WHERE ${conditions}
             )`;
    }
  }

  return { sql, params };
}
