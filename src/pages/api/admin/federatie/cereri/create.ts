import type { APIRoute } from 'astro';
import { execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || !user.club_id) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();

  const request_type = form.get('request_type') as string;
  const subject = (form.get('subject') as string)?.trim();
  const description = (form.get('description') as string)?.trim() ?? '';
  const player_id = (form.get('player_id') as string) || null;

  if (!request_type || !subject) {
    return redirect('/admin/federatie?err=date');
  }

  const validTypes = ['LEGITIMARE','TRANSFER','DEZLEGARE','DUBLA_LEGITIMARE','SUSPENDARE','CONTESTATIE','MODIFICARE_DATE','ALTELE'];
  if (!validTypes.includes(request_type)) {
    return redirect('/admin/federatie?err=tip');
  }

  const id = crypto.randomUUID();
  await execute(db,
    `INSERT INTO federation_requests (id, club_id, player_id, sport_code, request_type, subject, description, status, created_by)
     VALUES (?, ?, ?, (SELECT sport_code FROM clubs WHERE id = ?), ?, ?, ?, 'PENDING', ?)`,
    [id, user.club_id, player_id, user.club_id, request_type, subject, description, user.id]);

  return redirect(`/admin/federatie/cereri/${id}?msg=trimis`);
};
