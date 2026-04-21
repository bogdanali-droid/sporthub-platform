import type { APIRoute } from 'astro';
import { queryAll } from '@/lib/db';

export const GET: APIRoute = async ({ url, locals }) => {
  const user = locals.user;
  if (!user) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });
  if (!['ASSOCIATION_ADMIN','FEDERATION_ADMIN','SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const id = url.searchParams.get('id');
  if (!id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 });

  const groups = await queryAll<any>(db,
    `SELECT cg.id, cg.name,
            GROUP_CONCAT(cgt.team_name || ':' || cgt.wins || ':' || cgt.losses || ':' || cgt.points) AS teams_data
     FROM competition_groups cg
     LEFT JOIN competition_group_teams cgt ON cgt.group_id=cg.id
     WHERE cg.competition_id=?
     GROUP BY cg.id`,
    [id]);

  return new Response(JSON.stringify({ ok: true, groups }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
