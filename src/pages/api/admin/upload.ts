import type { APIRoute } from 'astro';

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const env = (locals as any).runtime?.env;
  const r2: R2Bucket = env?.R2;
  if (!r2) return json({ error: 'Storage unavailable' }, 503);

  const form = await request.formData();
  const file = form.get('file') as File | null;
  const folder = (form.get('folder') as string)?.trim() || 'misc';

  if (!file || file.size === 0) return json({ error: 'Niciun fișier selectat' }, 400);
  if (file.size > MAX_SIZE) return json({ error: 'Fișierul depășește 10 MB' }, 413);

  const ext = ALLOWED_MIME[file.type];
  if (!ext) return json({ error: 'Tip fișier nepermis. Sunt permise: JPG, PNG, WEBP, PDF' }, 415);

  const clubId = user.club_id ?? 'global';
  const ts = Date.now();
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const key = `clubs/${clubId}/${folder}/${ts}-${safe}`;

  await r2.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
    customMetadata: {
      uploadedBy: user.id,
      originalName: file.name,
    },
  });

  const appUrl = (env?.APP_URL as string) ?? '';
  const url = `${appUrl}/api/admin/media/${encodeURIComponent(key)}`;

  return json({ ok: true, key, url, size: file.size, type: file.type });
};

// Serve stored files
export const GET: APIRoute = async ({ request, locals, url }) => {
  const user = locals.user;
  if (!user) return new Response('Unauthorized', { status: 401 });

  const env = (locals as any).runtime?.env;
  const r2: R2Bucket = env?.R2;
  if (!r2) return new Response('Storage unavailable', { status: 503 });

  // key is in the URL path after /api/admin/media/
  const key = decodeURIComponent(url.pathname.replace('/api/admin/upload', '').replace(/^\//, ''));
  if (!key) return new Response('Key required', { status: 400 });

  // Security: club users can only access their own club's files
  if (!['SUPERADMIN','FEDERATION_ADMIN'].includes(user.role)) {
    const clubId = user.club_id ?? '';
    if (!key.startsWith(`clubs/${clubId}/`)) {
      return new Response('Forbidden', { status: 403 });
    }
  }

  const obj = await r2.get(key);
  if (!obj) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'private, max-age=3600');

  return new Response(obj.body, { headers });
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
