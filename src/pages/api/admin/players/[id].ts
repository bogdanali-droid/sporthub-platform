export const prerender = false;
import type { APIContext } from 'astro';

export async function GET({ params, locals }: APIContext) {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return new Response('DB unavailable', { status: 500 });
  const clubId = (locals as any).clubId ?? locals.user?.club_id;
  const { id } = params;

  const player = await db.prepare(
    'SELECT * FROM players WHERE id = ? AND club_id = ?'
  ).bind(id, clubId).first();
  if (!player) return new Response('Not found', { status: 404 });

  const teamAssignment = await db.prepare(
    'SELECT team_id FROM team_players WHERE player_id = ? AND left_at IS NULL'
  ).bind(id).first() as any;

  return Response.json({ ...player, team_id: teamAssignment?.team_id ?? null });
}

export async function POST({ params, request, locals }: APIContext) {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return new Response('DB unavailable', { status: 500 });

  const clubId = (locals as any).clubId ?? locals.user?.club_id;
  const playerId = params.id!;
  const redirectBase = `/admin/players/${playerId}`;
  const ct = request.headers.get('content-type') ?? '';

  let method = 'PUT';
  let data: Record<string, any> = {};
  let teamId: string | null | undefined = undefined;
  let photoFile: File | null = null;

  if (ct.includes('multipart/form-data') || ct.includes('application/x-www-form-urlencoded')) {
    const fd = await request.formData().catch(() => null);
    if (!fd) return new Response(null, { status: 302, headers: { Location: `${redirectBase}?err=bad_request` } });

    method = ((fd.get('_method') as string) ?? 'PUT').toUpperCase();
    data = {
      first_name:        fd.get('first_name') || null,
      last_name:         fd.get('last_name') || null,
      birth_date:        fd.get('birth_date') || null,
      gender:            fd.get('gender') || null,
      position:          fd.get('position') || null,
      jersey_number:     fd.get('jersey_number') ? parseInt(fd.get('jersey_number') as string) : null,
      status:            fd.get('status') || 'ACTIVE',
      license_number:    fd.get('license_number') || null,
      license_date:      fd.get('license_date') || null,
      cnp:               fd.get('cnp') || null,
      federation_id:     fd.get('federation_id') || null,
      address:           fd.get('address') || null,
      parent_name:       fd.get('parent_name') || null,
      parent_email:      fd.get('parent_email') || null,
      parent_phone:      fd.get('parent_phone') || null,
      player_email:      fd.get('player_email') || null,
      player_phone:      fd.get('player_phone') || null,
      player_whatsapp:   fd.get('player_whatsapp') || null,
      guardian2_name:    fd.get('guardian2_name') || null,
      guardian2_email:   fd.get('guardian2_email') || null,
      guardian2_phone:   fd.get('guardian2_phone') || null,
      emergency_contact: fd.get('emergency_contact') || null,
      emergency_phone:   fd.get('emergency_phone') || null,
      notes:             fd.get('notes') || null,
      joined_club_at:    fd.get('joined_club_at') || null,
    };
    const tid = fd.get('team_id') as string;
    teamId = tid !== null ? (tid || null) : undefined;
    const fv = fd.get('photo_file');
    if (fv instanceof File && fv.size > 0) photoFile = fv;

  } else {
    const body = await request.json().catch(() => null);
    if (!body) return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    method = ((body._method ?? 'PUT') as string).toUpperCase();
    data = body;
    teamId = 'team_id' in body ? (body.team_id || null) : undefined;
  }

  // ---- DELETE ----
  if (method === 'DELETE') {
    const existing = await db.prepare(
      'SELECT id FROM players WHERE id = ? AND club_id = ?'
    ).bind(playerId, clubId).first();
    if (!existing) return new Response(null, { status: 302, headers: { Location: '/admin/players' } });

    await db.prepare('DELETE FROM team_players WHERE player_id = ?').bind(playerId).run();
    await db.prepare('DELETE FROM match_selections WHERE player_id = ?').bind(playerId).run().catch(() => {});
    await db.prepare('DELETE FROM attendance WHERE player_id = ?').bind(playerId).run().catch(() => {});
    await db.prepare('DELETE FROM payments WHERE player_id = ? AND club_id = ?').bind(playerId, clubId).run().catch(() => {});
    await db.prepare('DELETE FROM medical_visits WHERE player_id = ? AND club_id = ?').bind(playerId, clubId).run().catch(() => {});
    await db.prepare('DELETE FROM physical_tests WHERE player_id = ? AND club_id = ?').bind(playerId, clubId).run().catch(() => {});
    await db.prepare('DELETE FROM player_evaluations WHERE player_id = ?').bind(playerId).run().catch(() => {});
    await db.prepare('DELETE FROM player_documents WHERE player_id = ? AND club_id = ?').bind(playerId, clubId).run().catch(() => {});
    await db.prepare('DELETE FROM players WHERE id = ? AND club_id = ?').bind(playerId, clubId).run();

    if (ct.includes('application/json')) return Response.json({ ok: true });
    return new Response(null, { status: 302, headers: { Location: '/admin/players?msg=sters' } });
  }

  // ---- PUT / UPDATE ----
  try {
    // Ensure new columns exist (idempotent, safe to call multiple times)
    await db.prepare('ALTER TABLE players ADD COLUMN cnp TEXT').run().catch(() => {});
    await db.prepare('ALTER TABLE players ADD COLUMN license_date TEXT').run().catch(() => {});
    await db.prepare('ALTER TABLE players ADD COLUMN photo_url TEXT').run().catch(() => {});

    // Photo upload to R2
    if (photoFile) {
      try {
        const r2 = (locals as any).runtime?.env?.R2;
        if (r2) {
          const ext = (photoFile.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
          const key = `players/${clubId}/${playerId}-${Date.now().toString(36)}.${ext}`;
          await r2.put(key, await photoFile.arrayBuffer(), { httpMetadata: { contentType: photoFile.type } });
          data.photo_url = `/api/media/${key}`;
          const prev = await db.prepare('SELECT photo_url FROM players WHERE id = ? AND club_id = ?').bind(playerId, clubId).first() as any;
          if (prev?.photo_url?.startsWith('/api/media/')) {
            const oldKey = prev.photo_url.slice('/api/media/'.length);
            if (oldKey && oldKey !== key) r2.delete(oldKey).catch(() => {});
          }
        }
      } catch { /* foto upload failed — continue without photo */ }
    }

    await db.prepare(`
      UPDATE players SET
        first_name = ?, last_name = ?, birth_date = ?, gender = ?,
        position = ?, jersey_number = ?, status = ?,
        license_number = ?, license_date = ?, cnp = ?, federation_id = ?,
        address = ?,
        parent_name = ?, parent_email = ?, parent_phone = ?,
        player_email = ?, player_phone = ?, player_whatsapp = ?,
        guardian2_name = ?, guardian2_email = ?, guardian2_phone = ?,
        emergency_contact = ?, emergency_phone = ?,
        notes = ?, joined_club_at = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND club_id = ?
    `).bind(
      data.first_name ?? null, data.last_name ?? null,
      data.birth_date ?? null, data.gender ?? null,
      data.position ?? null, data.jersey_number ?? null,
      data.status ?? 'ACTIVE',
      data.license_number ?? null, data.license_date ?? null,
      data.cnp ?? null, data.federation_id ?? null,
      data.address ?? null,
      data.parent_name ?? null, data.parent_email ?? null, data.parent_phone ?? null,
      data.player_email ?? null, data.player_phone ?? null, data.player_whatsapp ?? null,
      data.guardian2_name ?? null, data.guardian2_email ?? null, data.guardian2_phone ?? null,
      data.emergency_contact ?? null, data.emergency_phone ?? null,
      data.notes ?? null, data.joined_club_at ?? null,
      playerId, clubId
    ).run();

    if (data.photo_url) {
      await db.prepare('UPDATE players SET photo_url = ? WHERE id = ? AND club_id = ?')
        .bind(data.photo_url, playerId, clubId).run();
    }

    // Team assignment — check current → leave old → join new
    if (teamId !== undefined) {
      const current = await db.prepare(
        'SELECT team_id FROM team_players WHERE player_id = ? AND left_at IS NULL'
      ).bind(playerId).first() as any;

      if (teamId) {
        if (current && current.team_id !== teamId) {
          await db.prepare(
            'UPDATE team_players SET left_at = CURRENT_TIMESTAMP WHERE player_id = ? AND team_id = ? AND left_at IS NULL'
          ).bind(playerId, current.team_id).run();
        }
        if (!current || current.team_id !== teamId) {
          const season = new Date().getFullYear().toString();
          await db.prepare(
            'INSERT OR IGNORE INTO team_players (team_id, player_id, season) VALUES (?, ?, ?)'
          ).bind(teamId, playerId, season).run();
        }
      } else {
        await db.prepare(
          'UPDATE team_players SET left_at = CURRENT_TIMESTAMP WHERE player_id = ? AND left_at IS NULL'
        ).bind(playerId).run();
      }
    }

    if (ct.includes('application/json')) {
      const row = await db.prepare('SELECT * FROM players WHERE id = ? AND club_id = ?').bind(playerId, clubId).first();
      const ta = await db.prepare('SELECT team_id FROM team_players WHERE player_id = ? AND left_at IS NULL').bind(playerId).first() as any;
      return Response.json({ ...row, team_id: ta?.team_id ?? null });
    }
    return new Response(null, { status: 302, headers: { Location: `${redirectBase}?msg=salvat` } });

  } catch (e: any) {
    if (ct.includes('application/json')) return Response.json({ error: e.message }, { status: 500 });
    return new Response(null, { status: 302, headers: { Location: `${redirectBase}?err=eroare` } });
  }
}

export const PUT = POST;

export async function DELETE({ params, locals }: APIContext) {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  const clubId = (locals as any).clubId ?? locals.user?.club_id;
  const playerId = params.id!;

  const existing = await db.prepare('SELECT id FROM players WHERE id = ? AND club_id = ?').bind(playerId, clubId).first();
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

  await db.prepare('DELETE FROM team_players WHERE player_id = ?').bind(playerId).run();
  await db.prepare('DELETE FROM match_selections WHERE player_id = ?').bind(playerId).run().catch(() => {});
  await db.prepare('DELETE FROM attendance WHERE player_id = ?').bind(playerId).run().catch(() => {});
  await db.prepare('DELETE FROM payments WHERE player_id = ? AND club_id = ?').bind(playerId, clubId).run().catch(() => {});
  await db.prepare('DELETE FROM medical_visits WHERE player_id = ? AND club_id = ?').bind(playerId, clubId).run().catch(() => {});
  await db.prepare('DELETE FROM physical_tests WHERE player_id = ? AND club_id = ?').bind(playerId, clubId).run().catch(() => {});
  await db.prepare('DELETE FROM player_evaluations WHERE player_id = ?').bind(playerId).run().catch(() => {});
  await db.prepare('DELETE FROM player_documents WHERE player_id = ? AND club_id = ?').bind(playerId, clubId).run().catch(() => {});
  await db.prepare('DELETE FROM players WHERE id = ? AND club_id = ?').bind(playerId, clubId).run();

  return Response.json({ ok: true });
}
