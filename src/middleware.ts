import { defineMiddleware } from 'astro:middleware';
import { ADMIN_SESSION_COOKIE, isAdminAuthConfigured, verifyAdminSession } from '@/lib/server/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const protectedRoute = (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) || pathname.startsWith('/api/admin');
  if (protectedRoute) {
    const bypassForTests = import.meta.env.DEV && process.env.ADMIN_AUTH_DISABLED === 'true';
    if (!bypassForTests) {
      const authenticated = verifyAdminSession(context.cookies.get(ADMIN_SESSION_COOKIE)?.value);
      if (!authenticated) {
        if (pathname.startsWith('/api/admin')) {
          const configured = isAdminAuthConfigured();
          return Response.json({ error: configured ? 'Authentication required' : 'Admin authentication is not configured' }, { status: configured ? 401 : 503 });
        }
        const nextPath = `${pathname}${context.url.search}`;
        return context.redirect(`/admin/login/?next=${encodeURIComponent(nextPath)}`, 303);
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
