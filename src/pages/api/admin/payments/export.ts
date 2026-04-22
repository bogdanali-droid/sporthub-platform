export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals, url }) => {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB as D1Database;
  if (!db) return new Response('DB unavailable', { status: 500 });

  const clubId = locals.user.club_id;
  const statusFilter = url.searchParams.get('status') || '';
  const teamFilter = url.searchParams.get('team_id') || '';
  const playerSearch = url.searchParams.get('q') || '';

  let query = `
    SELECT pay.id, pay.status, pay.amount, pay.currency, pay.description,
           pay.payment_method as method, pay.reference, pay.due_date, pay.paid_at,
           p.first_name, p.last_name,
           t.name as team_name, t.age_group
    FROM payments pay
    JOIN players p ON p.id = pay.player_id
    LEFT JOIN team_players tp ON tp.player_id = p.id AND tp.left_at IS NULL
    LEFT JOIN teams t ON t.id = tp.team_id
    WHERE pay.club_id = ?
  `;
  const params: any[] = [clubId];

  if (statusFilter) { query += ' AND pay.status = ?'; params.push(statusFilter); }
  if (teamFilter)   { query += ' AND t.id = ?'; params.push(teamFilter); }
  if (playerSearch) {
    query += ' AND (p.first_name LIKE ? OR p.last_name LIKE ?)';
    params.push(`%${playerSearch}%`, `%${playerSearch}%`);
  }
  query += ` ORDER BY
    CASE pay.status WHEN 'OVERDUE' THEN 1 WHEN 'PENDING' THEN 2 WHEN 'PAID' THEN 3 ELSE 4 END,
    pay.due_date ASC`;

  const rows = (await db.prepare(query).bind(...params).all())?.results ?? [];

  function fmtDate(d: string | null) {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return d; }
  }
  function statusLabel(s: string) {
    return s === 'PAID' ? 'Plătit' : s === 'PENDING' ? 'In asteptare' : s === 'OVERDUE' ? 'Restant' : s === 'CANCELLED' ? 'Anulat' : s;
  }

  // BOM + CSV header
  const BOM = '﻿';
  const header = ['Jucator', 'Echipa', 'Varsta', 'Suma', 'Moneda', 'Descriere', 'Modalitate', 'Referinta', 'Scadenta', 'Status', 'Data platii'];
  const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const lines = [header.map(escape).join(',')];
  for (const r of rows as any[]) {
    lines.push([
      `${r.first_name} ${r.last_name}`,
      r.team_name || '',
      r.age_group || '',
      r.amount,
      r.currency || 'RON',
      r.description || '',
      r.method || '',
      r.reference || '',
      fmtDate(r.due_date),
      statusLabel(r.status),
      fmtDate(r.paid_at),
    ].map(escape).join(','));
  }

  const csv = BOM + lines.join('\r\n');
  const labelMap: Record<string, string> = { PAID: 'platite', PENDING: 'pendente', OVERDUE: 'restante', '': 'toate' };
  const filename = `plati_${labelMap[statusFilter] || statusFilter}_${new Date().toISOString().slice(0,10)}.csv`;

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
};
