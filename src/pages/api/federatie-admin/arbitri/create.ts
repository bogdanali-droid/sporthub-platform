import type { APIRoute } from 'astro';
import { execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || !['FEDERATION_ADMIN', 'SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();

  const first_name = (form.get('first_name') as string)?.trim();
  const last_name  = (form.get('last_name') as string)?.trim();
  const email      = (form.get('email') as string)?.trim() || null;
  const phone      = (form.get('phone') as string)?.trim() || null;
  const grade      = form.get('grade') as string;
  const sportCodes = form.getAll('sport_codes') as string[];

  if (!first_name || !last_name || !grade) {
    return redirect('/federatie-admin/arbitri?err=date-lipsa');
  }

  const id = crypto.randomUUID();
  await execute(db,
    `INSERT INTO arbitri (id, first_name, last_name, email, phone, grade, sport_codes, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [id, first_name, last_name, email, phone, grade, JSON.stringify(sportCodes)]);

  return redirect('/federatie-admin/arbitri?msg=creat');
};
