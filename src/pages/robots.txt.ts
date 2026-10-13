import type { APIRoute } from 'astro';
import { siteOrigin } from '@/lib/site';

export const GET: APIRoute = ({ url }) => {
  const base = siteOrigin(url);
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/admin/\n\nSitemap: ${base}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
