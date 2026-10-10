import { defineMiddleware } from 'astro:middleware';
import { ADMIN_SESSION_COOKIE, isAdminAuthConfigured, verifyAdminSession } from '@/lib/server/auth';

let activeDynamicRequests = 0;
const maxConcurrentRequests = Math.max(8, Math.min(200, Number(process.env.MAX_CONCURRENT_REQUESTS) || 48));

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const isDynamicRequest = pathname.startsWith('/api/') || pathname.startsWith('/admin') || pathname.startsWith('/es/articulos/') || pathname.startsWith('/en/articles/');
  if (isDynamicRequest && activeDynamicRequests >= maxConcurrentRequests) {
    return Response.json(
      { error: 'Service temporarily busy. Please retry.' },
      { status: 503, headers: { 'Retry-After': '3', 'Cache-Control': 'no-store' } },
    );
  }
  if (isDynamicRequest) activeDynamicRequests += 1;

  try {
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
    if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin') || pathname.startsWith('/api/auth') || pathname === '/api/health/') && !response.headers.has('Cache-Control')) {
      response.headers.set('Cache-Control', 'no-store');
    } else if (pathname.startsWith('/_astro/')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (pathname.startsWith('/videos/')) {
      response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    } else if (context.request.method === 'GET' && response.status === 200 && response.headers.get('Content-Type')?.includes('text/html') && !response.headers.has('Cache-Control')) {
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
    }
    return response;
  } finally {
    if (isDynamicRequest) activeDynamicRequests -= 1;
  }
});
