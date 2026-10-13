import type { APIRoute } from 'astro';
import { ADMIN_SESSION_COOKIE, adminCookieOptions, createAdminSession, isAdminAuthConfigured, verifyAdminCredentials } from '@/lib/server/auth';
import { assertSameOrigin } from '@/lib/server/validation';

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_TRACKED_CLIENTS = 1_000;

function pruneExpiredAttempts(now: number) {
  if (attempts.size < MAX_TRACKED_CLIENTS) return;
  for (const [key, value] of attempts) if (value.resetAt <= now) attempts.delete(key);
  while (attempts.size >= MAX_TRACKED_CLIENTS) attempts.delete(attempts.keys().next().value!);
}

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress }) => {
  try {
    assertSameOrigin(request);
    if (!isAdminAuthConfigured()) return new Response('Admin authentication is not configured', { status: 503 });

    // Detrás del proxy de Railway, clientAddress ya proviene de X-Forwarded-For
    // gracias a security.allowedDomains.
    const key = clientAddress || 'unknown';
    const now = Date.now();
    pruneExpiredAttempts(now);
    const current = attempts.get(key);
    const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + WINDOW_MS } : current;
    if (entry.count >= MAX_ATTEMPTS) return redirect('/admin/login/?error=locked', 303);

    const data = await request.formData();
    const username = String(data.get('username') || '').slice(0, 120);
    const password = String(data.get('password') || '').slice(0, 512);
    if (!verifyAdminCredentials(username, password)) {
      entry.count += 1;
      attempts.set(key, entry);
      return redirect('/admin/login/?error=invalid', 303);
    }

    attempts.delete(key);
    const session = createAdminSession(username);
    cookies.set(ADMIN_SESSION_COOKIE, session.token, adminCookieOptions(session.maxAge));
    const requestedNext = String(data.get('next') || '/admin/');
    const next = requestedNext.startsWith('/admin/') && !requestedNext.startsWith('/admin/login') ? requestedNext : '/admin/';
    return redirect(next, 303);
  } catch {
    return redirect('/admin/login/?error=invalid', 303);
  }
};
