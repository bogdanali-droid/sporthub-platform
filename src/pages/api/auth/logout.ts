import type { APIRoute } from 'astro';
import { logout } from '@/lib/auth';

const doLogout: APIRoute = async ({ cookies, locals, redirect }) => {
  const token = cookies.get('session')?.value;
  const env = (locals as any).runtime?.env;
  if (token && env) await logout(token, env);
  cookies.delete('session', { path: '/' });
  return redirect('/login');
};

export const GET = doLogout;
export const POST = doLogout;
