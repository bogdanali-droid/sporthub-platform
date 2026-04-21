/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type SessionUser = import('@/lib/auth').SessionUser;

declare namespace App {
  interface Locals {
    user: SessionUser | null;
    clubId: string | null;
    clientIP: string;
    runtime: {
      env: {
        DB: D1Database;
        SESSION_KV: KVNamespace;
        R2: R2Bucket;
        ENVIRONMENT: string;
        APP_URL: string;
        CRON_SECRET: string;
      };
    };
  }
}
