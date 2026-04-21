import type { APIRoute } from 'astro';
import { execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || !['FEDERATION_ADMIN', 'SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();

  const name         = (form.get('name') as string)?.trim();
  const sport_code   = form.get('sport_code') as string;
  const season       = (form.get('season') as string)?.trim();
  const age_group    = (form.get('age_group') as string) || 'OPEN';
  const format       = (form.get('format') as string) || 'LEAGUE';
  const innings_raw  = form.get('innings_count') as string;
  const innings_count = innings_raw ? parseInt(innings_raw, 10) : null;

  if (!name || !sport_code || !season) {
    return redirect('/federatie-admin/competitii?err=date-lipsa');
  }

  const id = crypto.randomUUID();
  await execute(db,
    `INSERT INTO federation_competitions (id, name, sport_code, season, age_group, format, innings_count, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [id, name, sport_code, season, age_group, format, innings_count]);

  return redirect('/federatie-admin/competitii?msg=creat');
};
