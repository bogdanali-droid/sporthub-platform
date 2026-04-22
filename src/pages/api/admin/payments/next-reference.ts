export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals, url }) => {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });

  const env = (locals as any).runtime?.env;
  const db = env?.DB as D1Database;
  if (!db) return new Response('Database unavailable', { status: 500 });

  const clubId = locals.user.club_id;
  const serie = (url.searchParams.get('serie') || '').trim().toUpperCase();
  if (!serie) return new Response(JSON.stringify({ next: null }), { headers: { 'Content-Type': 'application/json' } });

  // Find all references matching the pattern SERIE-NNN
  const rows = await db.prepare(
    `SELECT reference FROM payments WHERE club_id = ? AND reference LIKE ? ORDER BY reference DESC`
  ).bind(clubId, `${serie}-%`).all();

  let maxNr = 0;
  for (const row of (rows?.results ?? []) as any[]) {
    const ref = (row.reference || '') as string;
    const parts = ref.split('-');
    const nr = parseInt(parts[parts.length - 1]);
    if (!isNaN(nr) && nr > maxNr) maxNr = nr;
  }

  const nextNr = maxNr + 1;
  const next = `${serie}-${String(nextNr).padStart(3, '0')}`;

  return new Response(JSON.stringify({ next, nextNr, serie }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
