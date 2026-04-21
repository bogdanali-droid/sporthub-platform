import type { APIRoute } from 'astro';
import { execute } from '@/lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || !['FEDERATION_ADMIN','SUPERADMIN'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const db = (locals as any).runtime?.env?.DB;
  const form = await request.formData();

  const player_id     = (form.get('player_id') as string)?.trim();
  const from_club_id  = (form.get('from_club_id') as string)?.trim() || null;
  const to_club_id    = (form.get('to_club_id') as string)?.trim();
  const sport_code    = form.get('sport_code') as string;
  const transfer_type = (form.get('transfer_type') as string) ?? 'PERMANENT';
  const notes         = (form.get('notes') as string) ?? '';

  if (!player_id || !to_club_id || !sport_code) {
    return redirect('/federatie-admin/transferuri?err=date-lipsa');
  }

  // Determine transfer window
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  let transfer_window: string | null = null;
  if (m === 1) transfer_window = 'JAN';
  else if ((m === 6 && d >= 15) || m === 7 || (m === 8 && d <= 15)) transfer_window = 'JUN_AUG';

  await execute(db,
    `INSERT INTO player_transfers (id, player_id, from_club_id, to_club_id, sport_code, transfer_type, transfer_window, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
    [crypto.randomUUID(), player_id, from_club_id, to_club_id, sport_code, transfer_type, transfer_window, notes]);

  return redirect('/federatie-admin/transferuri?msg=creat');
};
