import { createHash } from 'node:crypto';
import { defineMiddleware } from 'astro:middleware';
import { ADMIN_SESSION_COOKIE, isAdminAuthConfigured, verifyAdminSession } from '@/lib/server/auth';
import { redirects } from '@/lib/redirects.config';

let activeDynamicRequests = 0;
const maxConcurrentRequests = Math.max(8, Math.min(200, Number(process.env.MAX_CONCURRENT_REQUESTS) || 48));
const redirectRules = new Map(redirects.map((rule) => [rule.oldUrl, rule]));

async function withEtag(request: Request, response: Response) {
  const body = new Uint8Array(await response.arrayBuffer());
  const etag = `W/"${createHash('sha1').update(body).digest('base64url')}"`;
  const headers = new Headers(response.headers);
  headers.set('ETag', etag);
  const ifNoneMatch = request.headers.get('if-none-match')?.split(',').map((value) => value.trim());
  if (ifNoneMatch?.includes(etag)) {
    headers.delete('Content-Length');
    return new Response(null, { status: 304, headers });
  }
  return new Response(body, { status: response.status, statusText: response.statusText, headers });
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Las páginas prerenderizadas se generan en el build y se sirven como archivos
  // estáticos con su propia ETag; aquí no hay solicitud real que revisar.
  if (context.isPrerendered) return next();
  const pathname = context.url.pathname;
  const redirect = redirectRules.get(pathname);
  if (redirect) return context.redirect(redirect.newUrl, redirect.status);

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
            return Response.json({ error: configured ? 'La sesión expiró. Vuelve a iniciar sesión.' : 'Admin authentication is not configured' }, { status: configured ? 401 : 503 });
          }
          const nextPath = `${pathname}${context.url.search}`;
          return context.redirect(`/admin/login/?next=${encodeURIComponent(nextPath)}`, 303);
        }
      }
    }

    const response = await next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (context.url.protocol === 'https:') response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin') || pathname.startsWith('/api/auth') || pathname === '/api/health/') && !response.headers.has('Cache-Control')) {
      response.headers.set('Cache-Control', 'no-store');
    } else if (pathname.startsWith('/_astro/')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (context.request.method === 'GET' && response.headers.get('Content-Type')?.includes('text/html') && !response.headers.has('Cache-Control')) {
      // El HTML se revalida en cada visita: tras un despliegue todos ven la versión
      // nueva sin agregar ?v= al enlace. Con la ETag, si nada cambió la respuesta es
      // un 304 sin cuerpo. CSS, JS, imágenes y video conservan su caché anual
      // porque su nombre cambia en cada build.
      response.headers.set('Cache-Control', 'no-cache');
      if (response.status === 200) return withEtag(context.request, response);
    }
    return response;
  } finally {
    if (isDynamicRequest) activeDynamicRequests -= 1;
  }
});
