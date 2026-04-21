import { queryFirst, execute } from './db';

export interface SessionUser {
  id: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'COACH' | 'PLAYER' | 'PARENT' | 'VIEWER' | 'FEDERATION_ADMIN' | 'ASSOCIATION_ADMIN';
  club_id: string | null;
  sport_code: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  federation_id: string | null;
  association_id: string | null;
  is_platform_user?: boolean;
}

const SESSION_TTL = 7 * 24 * 60 * 60;

async function hashPbkdf2(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 }, key, 256);
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2:${saltHex}:${hashHex}`;
}

async function verifyPbkdf2(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':');
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false;
  const salt = new Uint8Array(parts[1].match(/.{2}/g)!.map(b => parseInt(b, 16)));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 }, key, 256);
  const newHash = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return newHash === parts[2];
}

export async function login(
  db: D1Database,
  kv: KVNamespace,
  email: string,
  password: string,
  ip: string
): Promise<{ token: string; user: SessionUser } | null> {
  const attempts = parseInt(await kv.get(`bf:${ip}`) || '0');
  if (attempts >= 10) return null;

  const user = await queryFirst<any>(db,
    `SELECT u.*, c.sport_code FROM users u
     LEFT JOIN clubs c ON c.id = u.club_id
     WHERE u.email = ? AND u.is_active = 1`, [email.toLowerCase()]);

  if (!user) {
    await kv.put(`bf:${ip}`, String(attempts + 1), { expirationTtl: 900 });
    return null;
  }

  const valid = await verifyPbkdf2(password, user.password_hash);
  if (!valid) {
    await kv.put(`bf:${ip}`, String(attempts + 1), { expirationTtl: 900 });
    return null;
  }

  await kv.delete(`bf:${ip}`);

  const token = crypto.randomUUID();
  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    club_id: user.club_id,
    sport_code: user.sport_code,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar_url: user.avatar_url,
    federation_id: null,
    association_id: null,
    is_platform_user: false,
  };

  await kv.put(`session:${token}`, JSON.stringify(sessionUser), { expirationTtl: SESSION_TTL });
  await execute(db, 'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

  return { token, user: sessionUser };
}

export async function loginPlatformUser(
  db: D1Database,
  kv: KVNamespace,
  email: string,
  password: string,
  ip: string
): Promise<{ token: string; user: SessionUser } | null> {
  const attempts = parseInt(await kv.get(`bf:${ip}`) || '0');
  if (attempts >= 10) return null;

  const user = await queryFirst<any>(db,
    `SELECT * FROM platform_users WHERE email = ? AND is_active = 1`,
    [email.toLowerCase()]);

  if (!user) {
    await kv.put(`bf:${ip}`, String(attempts + 1), { expirationTtl: 900 });
    return null;
  }

  const valid = await verifyPbkdf2(password, user.password_hash);
  if (!valid) {
    await kv.put(`bf:${ip}`, String(attempts + 1), { expirationTtl: 900 });
    return null;
  }

  await kv.delete(`bf:${ip}`);

  const token = crypto.randomUUID();
  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    role: user.role as SessionUser['role'],
    club_id: null,
    sport_code: null,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar_url: null,
    federation_id: user.federation_id ?? null,
    association_id: user.association_id ?? null,
    is_platform_user: true,
  };

  await kv.put(`session:${token}`, JSON.stringify(sessionUser), { expirationTtl: SESSION_TTL });

  return { token, user: sessionUser };
}

export async function getSession(
  token: string,
  env: { SESSION_KV: KVNamespace }
): Promise<{ user: SessionUser } | null> {
  const raw = await env.SESSION_KV.get(`session:${token}`);
  if (!raw) return null;
  try {
    return { user: JSON.parse(raw) as SessionUser };
  } catch {
    return null;
  }
}

export async function refreshSession(token: string, env: { SESSION_KV: KVNamespace }): Promise<void> {
  const raw = await env.SESSION_KV.get(`session:${token}`);
  if (!raw) return;
  await env.SESSION_KV.put(`session:${token}`, raw, { expirationTtl: SESSION_TTL });
}

export async function logout(token: string, env: { SESSION_KV: KVNamespace }): Promise<void> {
  await env.SESSION_KV.delete(`session:${token}`);
}

export async function hashPassword(password: string): Promise<string> {
  return hashPbkdf2(password);
}
