export const prerender = false;
import type { APIRoute } from 'astro';
import { queryAll, queryFirst } from '@/lib/db';

export const GET: APIRoute = async ({ locals, url }) => {
  if (!locals.user || !['ADMIN', 'SUPERADMIN', 'COACH'].includes(locals.user.role))
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const db = (locals as any).runtime?.env?.DB;
  const clubId = locals.user.club_id;

  // Payments by month (last 6 months)
  const paymentsByMonth = await queryAll<any>(db, `
    SELECT
      strftime('%Y-%m', due_date) AS month,
      SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END) AS paid,
      SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'OVERDUE' THEN amount ELSE 0 END) AS overdue,
      COUNT(*) AS total_count
    FROM payments
    WHERE club_id = ?
      AND due_date >= date('now', '-6 months')
    GROUP BY month
    ORDER BY month ASC
  `, [clubId]);

  // Player status breakdown
  const playerStats = await queryAll<any>(db, `
    SELECT status, COUNT(*) AS count
    FROM players
    WHERE club_id = ?
    GROUP BY status
  `, [clubId]);

  // Match results (last 10)
  const matchResults = await queryAll<any>(db, `
    SELECT
      match_date,
      home_team_name,
      away_team_name,
      score_home,
      score_away,
      status,
      is_home
    FROM matches
    WHERE club_id = ? AND status = 'FINISHED'
    ORDER BY match_date DESC
    LIMIT 10
  `, [clubId]);

  // Win/loss/draw counts
  const matchSummary = await queryFirst<any>(db, `
    SELECT
      COUNT(*) AS total,
      SUM(CASE
        WHEN (is_home = 1 AND score_home > score_away)
          OR (is_home = 0 AND score_away > score_home)
        THEN 1 ELSE 0 END) AS wins,
      SUM(CASE
        WHEN score_home = score_away THEN 1 ELSE 0 END) AS draws,
      SUM(CASE
        WHEN (is_home = 1 AND score_home < score_away)
          OR (is_home = 0 AND score_away < score_home)
        THEN 1 ELSE 0 END) AS losses,
      SUM(CASE WHEN is_home = 1 THEN score_home ELSE score_away END) AS goals_scored,
      SUM(CASE WHEN is_home = 1 THEN score_away ELSE score_home END) AS goals_conceded
    FROM matches
    WHERE club_id = ? AND status = 'FINISHED'
  `, [clubId]);

  // Attendance by month (last 6 months)
  const attendanceByMonth = await queryAll<any>(db, `
    SELECT
      strftime('%Y-%m', t.date) AS month,
      COUNT(DISTINCT t.id) AS trainings,
      COUNT(a.id) AS total_records,
      SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS present,
      ROUND(AVG(CASE WHEN a.status = 'PRESENT' THEN 100.0 ELSE 0 END), 1) AS rate
    FROM trainings t
    LEFT JOIN attendance a ON a.training_id = t.id
    WHERE t.club_id = ?
      AND t.date >= date('now', '-6 months')
    GROUP BY month
    ORDER BY month ASC
  `, [clubId]);

  // Top evaluated players (average score)
  const topPlayers = await queryAll<any>(db, `
    SELECT
      p.first_name || ' ' || p.last_name AS name,
      p.position,
      COUNT(DISTINCT pe.id) AS eval_count,
      ROUND(AVG(pes.score), 2) AS avg_score
    FROM players p
    JOIN player_evaluations pe ON pe.player_id = p.id
    JOIN player_eval_scores pes ON pes.evaluation_id = pe.id
    WHERE p.club_id = ?
    GROUP BY p.id
    HAVING eval_count > 0
    ORDER BY avg_score DESC
    LIMIT 8
  `, [clubId]);

  // Payment collection rate by team
  const paymentByTeam = await queryAll<any>(db, `
    SELECT
      t.name AS team_name,
      COUNT(pay.id) AS total,
      SUM(CASE WHEN pay.status = 'PAID' THEN 1 ELSE 0 END) AS paid,
      SUM(pay.amount) AS total_amount,
      SUM(CASE WHEN pay.status = 'PAID' THEN pay.amount ELSE 0 END) AS paid_amount
    FROM teams t
    JOIN team_players tp ON tp.team_id = t.id AND tp.left_at IS NULL
    JOIN payments pay ON pay.player_id = tp.player_id AND pay.club_id = t.club_id
    WHERE t.club_id = ?
    GROUP BY t.id
    ORDER BY total_amount DESC
  `, [clubId]);

  // Players added per month (last 6 months)
  const playersGrowth = await queryAll<any>(db, `
    SELECT
      strftime('%Y-%m', created_at) AS month,
      COUNT(*) AS added
    FROM players
    WHERE club_id = ?
      AND created_at >= date('now', '-6 months')
    GROUP BY month
    ORDER BY month ASC
  `, [clubId]);

  return new Response(JSON.stringify({
    paymentsByMonth,
    playerStats,
    matchResults,
    matchSummary,
    attendanceByMonth,
    topPlayers,
    paymentByTeam,
    playersGrowth,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
