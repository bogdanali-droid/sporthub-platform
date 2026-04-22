export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB as D1Database;
  if (!db) return new Response('DB unavailable', { status: 500 });

  const clubId = locals.user.club_id;

  await db.prepare(`CREATE TABLE IF NOT EXISTS player_exemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id TEXT NOT NULL, player_id TEXT NOT NULL,
    exemption_type TEXT NOT NULL DEFAULT 'BURSA_SPORTIVA',
    notes TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(club_id, player_id)
  )`).run().catch(() => {});

  const rows = await db.prepare(`
    SELECT pe.*, p.first_name, p.last_name
    FROM player_exemptions pe
    JOIN players p ON p.id = pe.player_id
    WHERE pe.club_id = ?
    ORDER BY p.last_name, p.first_name
  `).bind(clubId).all();

  return new Response(JSON.stringify(rows?.results ?? []), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || (locals.user as any).role !== 'ADMIN') {
    return new Response('Forbidden', { status: 403 });
  }
  const db = (locals as any).runtime?.env?.DB as D1Database;
  if (!db) return new Response('DB unavailable', { status: 500 });

  const clubId = locals.user.club_id;

  await db.prepare(`CREATE TABLE IF NOT EXISTS player_exemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id TEXT NOT NULL, player_id TEXT NOT NULL,
    exemption_type TEXT NOT NULL DEFAULT 'BURSA_SPORTIVA',
    notes TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(club_id, player_id)
  )`).run().catch(() => {});

  const body = await request.json().catch(() => null);
  if (!body?.player_id || !body?.exemption_type) {
    return new Response(JSON.stringify({ error: 'player_id and exemption_type required' }), { status: 400 });
  }
  const allowed = ['BURSA_SPORTIVA', 'COPIL_ANTRENOR', 'CAZ_SOCIAL'];
  if (!allowed.includes(body.exemption_type)) {
    return new Response(JSON.stringify({ error: 'invalid exemption_type' }), { status: 400 });
  }

  // Verify player belongs to this club
  const player = await db.prepare('SELECT id FROM players WHERE id = ? AND club_id = ?')
    .bind(body.player_id, clubId).first();
  if (!player) return new Response(JSON.stringify({ error: 'player not found' }), { status: 404 });

  await db.prepare(`
    INSERT INTO player_exemptions (club_id, player_id, exemption_type, notes)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(club_id, player_id) DO UPDATE SET exemption_type = excluded.exemption_type, notes = excluded.notes
  `).bind(clubId, body.player_id, body.exemption_type, body.notes ?? null).run();

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  if (!locals.user || (locals.user as any).role !== 'ADMIN') {
    return new Response('Forbidden', { status: 403 });
  }
  const db = (locals as any).runtime?.env?.DB as D1Database;
  if (!db) return new Response('DB unavailable', { status: 500 });

  const clubId = locals.user.club_id;
  const body = await request.json().catch(() => null);
  if (!body?.player_id) {
    return new Response(JSON.stringify({ error: 'player_id required' }), { status: 400 });
  }

  await db.prepare('DELETE FROM player_exemptions WHERE club_id = ? AND player_id = ?')
    .bind(clubId, body.player_id).run();

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
};
