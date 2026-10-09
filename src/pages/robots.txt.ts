import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url }) => {
  const base = (process.env.PUBLIC_SITE_URL || url.origin).replace(/\/$/, '');
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/admin/\n\nSitemap: ${base}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
