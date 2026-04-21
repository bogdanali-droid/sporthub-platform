import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env;

  const checks: Record<string, string> = {
    runtime: env ? 'ok' : 'MISSING — not running on Cloudflare Pages',
    DB:         env?.DB          ? 'ok' : 'MISSING — set D1 binding named DB in Pages settings',
    SESSION_KV: env?.SESSION_KV  ? 'ok' : 'MISSING — set KV binding named SESSION_KV in Pages settings',
    R2:         env?.R2          ? 'ok' : 'MISSING — set R2 binding named R2 in Pages settings',
  };

  // Test DB connectivity
  if (env?.DB) {
    try {
      const r = await env.DB.prepare('SELECT COUNT(*) AS c FROM clubs').first<{c:number}>();
      checks.DB = `ok — ${r?.c ?? 0} clubs in DB`;
    } catch (e: any) {
      checks.DB = `ERROR — ${e?.message}`;
    }
  }

  // Test KV connectivity
  if (env?.SESSION_KV) {
    try {
      await env.SESSION_KV.put('health-check', '1', { expirationTtl: 60 });
      const v = await env.SESSION_KV.get('health-check');
      checks.SESSION_KV = v === '1' ? 'ok — KV read/write works' : 'ERROR — KV write/read mismatch';
    } catch (e: any) {
      checks.SESSION_KV = `ERROR — ${e?.message}`;
    }
  }

  const allOk = Object.values(checks).every(v => v.startsWith('ok'));

  return new Response(JSON.stringify({ status: allOk ? 'ok' : 'degraded', checks }, null, 2), {
    status: allOk ? 200 : 503,
    headers: { 'Content-Type': 'application/json' },
  });
};
