import type { APIRoute } from 'astro';
import { queryFirst, execute } from '@/lib/db';

export const POST: APIRoute = async ({ locals, params, request }) => {
  if (!locals.user || !['ADMIN','SUPERADMIN','COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const clubId = (locals as any).clubId ?? locals.user?.club_id;
  const id = params.id;
  const body = await request.json() as any;

  // body: { inning: number, half: 'TOP'|'BOTTOM', runs: number }
  const { inning, half, runs } = body;
  if (!inning || !half || runs == null)
    return new Response(JSON.stringify({ error: 'inning, half, runs required' }), { status: 400 });

  const match = await queryFirst<any>(db, `SELECT * FROM matches WHERE id=? AND club_id=?`, [id, clubId]);
  if (!match) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  const periods: any[] = match.period_data ? JSON.parse(match.period_data) : [];

  // Upsert inning entry
  const existing = periods.find((p: any) => p.inning === inning);
  if (existing) {
    existing[half === 'TOP' ? 'top' : 'bottom'] = runs;
  } else {
    const entry: any = { inning, top: 0, bottom: 0 };
    entry[half === 'TOP' ? 'top' : 'bottom'] = runs;
    periods.push(entry);
    periods.sort((a: any, b: any) => a.inning - b.inning);
  }

  // Recalculate totals: HOME = TOP half (visiting team bats top), AWAY = BOTTOM (home bats bottom)
  // In baseball convention: TOP = visitors, BOTTOM = home team
  // For simplicity we track home club as BOTTOM
  const scoreHome = periods.reduce((s: number, p: any) => s + (p.bottom || 0), 0);
  const scoreAway = periods.reduce((s: number, p: any) => s + (p.top || 0), 0);

  await execute(db,
    `UPDATE matches SET period_data=?, score_home=?, score_away=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND club_id=?`,
    [JSON.stringify(periods), scoreHome, scoreAway, id, clubId]);

  return new Response(JSON.stringify({ ok: true, period_data: periods, score_home: scoreHome, score_away: scoreAway }));
};
