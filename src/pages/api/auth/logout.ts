import type { APIRoute } from 'astro';
import { ADMIN_SESSION_COOKIE, adminCookieOptions } from '@/lib/server/auth';
import { assertSameOrigin } from '@/lib/server/validation';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try { assertSameOrigin(request); } catch { return new Response('Cross-origin request rejected', { status: 403 }); }
  cookies.delete(ADMIN_SESSION_COOKIE, adminCookieOptions(0));
  return redirect('/admin/login/?loggedOut=1', 303);
};
