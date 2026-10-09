import { defineMiddleware } from 'astro:middleware';
import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (value: string) => createHash('sha256').update(value).digest();
const safeEqual = (left: string, right: string) => timingSafeEqual(digest(left), digest(right));

export const onRequest = defineMiddleware(async (context, next) => {
  const protectedRoute = context.url.pathname.startsWith('/admin') || context.url.pathname.startsWith('/api/admin');
  if (protectedRoute) {
    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD;
    const allowUnconfiguredLocal = import.meta.env.DEV && !expectedPassword;
    if (!allowUnconfiguredLocal) {
      if (!expectedPassword) return new Response('ADMIN_PASSWORD is not configured', { status: 503 });
      const authorization = context.request.headers.get('authorization');
      let valid = false;
      if (authorization?.startsWith('Basic ')) {
        try {
          const [username, password] = atob(authorization.slice(6)).split(':', 2);
          valid = safeEqual(username, expectedUser) && safeEqual(password, expectedPassword);
        } catch { valid = false; }
      }
      if (!valid) {
        return new Response('Authentication required', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Dr. Ronald Admin", charset="UTF-8"' },
        });
      }
    }
  }

  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (context.url.protocol === 'https:') response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return response;
});
