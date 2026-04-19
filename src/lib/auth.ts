import { D1Database, queryFirst, execute } from './db';
import bcrypt from 'bcryptjs';

export interface SessionUser {
  id: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'COACH' | 'PLAYER' | 'PARENT' | 'VIEWER';
  club_id: string | null;
  sport_code: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

const SESSION_TTL = 7 * 24 * 60 * 60; // 7 zile in secunde

export async function login(
  db: D1Database,
  kv: KVNamespace,
  email: string,
  password: string,
  ip: string
): Promise<{ token: string; user: SessionUser } | null> {
  // Brute-force protection
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

  const valid = await bcrypt.compare(password, user.password_hash);
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
  };

  await kv.put(`session:${token}`, JSON.stringify(sessionUser), { expirationTtl: SESSION_TTL });
  await execute(db, 'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

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

export async function refreshSession(
  token: string,
  env: { SESSION_KV: KVNamespace }
): Promise<void> {
  const raw = await env.SESSION_KV.get(`session:${token}`);
  if (!raw) return;
  await env.SESSION_KV.put(`session:${token}`, raw, { expirationTtl: SESSION_TTL });
}

export async function logout(
  token: string,
  env: { SESSION_KV: KVNamespace }
): Promise<void> {
  await env.SESSION_KV.delete(`session:${token}`);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
