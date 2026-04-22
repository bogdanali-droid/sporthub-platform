export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const r2 = (locals as any).runtime?.env?.R2;
  if (!r2) return new Response('Storage unavailable', { status: 503 });

  const path = params.path;
  if (!path) return new Response('Not found', { status: 404 });

  // Security: only allow paths under players/ or clubs/
  if (!path.startsWith('players/') && !path.startsWith('clubs/') && !path.startsWith('matches/')) {
    return new Response('Forbidden', { status: 403 });
  }

  const url = new URL(request.url);
  const width = parseInt(url.searchParams.get('w') ?? '0') || 0;

  const object = await r2.get(path);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType ?? 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('ETag', object.etag ?? '');

  // If Cloudflare Image Resizing is available and width requested, use it
  if (width > 0 && width <= 1200) {
    const cfRequest = new Request(request.url, {
      cf: {
        image: {
          width,
          fit: 'cover',
          quality: 85,
          format: 'auto',
        },
      } as any,
    } as any);

    // Try CF Image Resizing — fall through to raw on error
    try {
      const imageRes = await fetch(cfRequest);
      if (imageRes.ok) {
        const resHeaders = new Headers(imageRes.headers);
        resHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
        return new Response(imageRes.body, { headers: resHeaders });
      }
    } catch { /* fall through */ }
  }

  // Return raw object from R2
  const body = await object.arrayBuffer();
  return new Response(body, { headers });
};
