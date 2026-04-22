import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user || (user as any).role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = (locals as any).runtime?.env?.DB as D1Database | undefined;
  if (!db) {
    return new Response(JSON.stringify({ error: 'db' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const clubId = user.club_id;

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const teamId = fd.get('team_id') as string;
  const amount = parseFloat(fd.get('amount') as string);
  const description = ((fd.get('description') as string) || 'Cotizație').trim();
  const dueDate = (fd.get('due_date') as string) || null;

  if (!amount || isNaN(amount) || amount <= 0) {
    return new Response(JSON.stringify({ error: 'invalid_amount' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Ensure exemptions table exists
  await db.prepare(`CREATE TABLE IF NOT EXISTS player_exemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id TEXT NOT NULL, player_id TEXT NOT NULL,
    exemption_type TEXT NOT NULL DEFAULT 'BURSA_SPORTIVA',
    notes TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(club_id, player_id)
  )`).run().catch(() => {});

  // Get exempt player IDs for this club
  const exemptRes = await db.prepare(
    'SELECT player_id FROM player_exemptions WHERE club_id = ?'
  ).bind(clubId).all();
  const exemptIds = new Set((exemptRes?.results ?? []).map((r: any) => r.player_id));

  // Get players from team (or all active players in club)
  let players: any[];
  if (teamId) {
    // Verify team belongs to this club first
    const teamOk = await db.prepare(
      'SELECT id FROM teams WHERE id = ? AND club_id = ?'
    ).bind(teamId, clubId).first();
    if (!teamOk) {
      return new Response(JSON.stringify({ error: 'team_not_found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    players = (await db.prepare(`
      SELECT p.id FROM players p
      JOIN team_players tp ON tp.player_id = p.id
      WHERE tp.team_id = ? AND tp.left_at IS NULL AND p.status = 'ACTIVE' AND p.club_id = ?
    `).bind(teamId, clubId).all())?.results ?? [];
  } else {
    players = (await db.prepare(
      `SELECT id FROM players WHERE club_id = ? AND status = 'ACTIVE'`
    ).bind(clubId).all())?.results ?? [];
  }

  // Filter out exempted players
  const exemptedCount = players.filter((p: any) => exemptIds.has(p.id)).length;
  players = players.filter((p: any) => !exemptIds.has(p.id));

  let created = 0;
  for (const player of players as any[]) {
    try {
      const paymentId = Array.from(
        crypto.getRandomValues(new Uint8Array(16)),
        b => b.toString(16).padStart(2, '0')
      ).join('');
      await db.prepare(`
        INSERT INTO payments (id, club_id, player_id, amount, currency, description, due_date, status, created_by)
        VALUES (?, ?, ?, ?, 'RON', ?, ?, 'PENDING', ?)
      `).bind(paymentId, clubId, player.id, amount, description, dueDate, user.id).run();
      created++;
    } catch (e) {
      console.error('Bulk payment insert error for player', player.id, e);
    }
  }

  return new Response(JSON.stringify({ ok: true, created, exempted: exemptedCount }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
