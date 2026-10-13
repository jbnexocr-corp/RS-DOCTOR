import type { APIRoute } from 'astro';
import { innerPages } from '@/data/innerPages';
import { serviceDetails } from '@/data/serviceDetails';
import { listPublishedArticles } from '@/lib/server/content';
import { draftPagesNoindex, siteOrigin } from '@/lib/site';

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' })[char]!);

export const GET: APIRoute = async ({ url }) => {
  const base = siteOrigin(url);
  // Solo URLs indexables: las páginas en borrador llevan noindex y no deben
  // enviarse a los buscadores hasta su aprobación.
  const paths = new Set<string>(['/es/', '/en/', '/es/articulos/', '/en/articles/']);
  if (!draftPagesNoindex) {
    innerPages.es.forEach((page) => paths.add(`/es/${page.slug}/`));
    innerPages.en.forEach((page) => paths.add(`/en/${page.slug}/`));
    serviceDetails.es.forEach((service) => paths.add(`/es/servicios/${service.slug}/`));
    serviceDetails.en.forEach((service) => paths.add(`/en/services/${service.slug}/`));
  }
  const articles = await listPublishedArticles().catch(() => []);
  articles.forEach((article) => paths.add(`/${article.locale}/${article.locale === 'es' ? 'articulos' : 'articles'}/${article.slug}/`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...paths].sort().map((path) => `  <url><loc>${escapeXml(`${base}${path}`)}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=900' } });
};
