import type { AstroGlobal } from 'astro';
import type { Locale } from '@/lib/i18n';
import { getPublishedArticle, listPublishedArticles } from './content';

// La caché HTTP de estas páginas la fija el middleware (revalidación con ETag);
// el servidor ya conserva los artículos 60 s en memoria.
function markUnavailable(response: AstroGlobal['response']) {
  response.status = 503;
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Retry-After', '30');
}

/** Carga un artículo publicado y fija el estado HTTP real (200, 404 o 503). Debe llamarse desde la página. */
export async function loadArticleForPage(Astro: AstroGlobal, locale: Locale, slug: string) {
  try {
    const article = await getPublishedArticle(locale, slug);
    if (!article) Astro.response.status = 404;
    return { article, serviceUnavailable: false };
  } catch {
    markUnavailable(Astro.response);
    return { article: undefined, serviceUnavailable: true };
  }
}

/** Lista los artículos publicados del idioma; ante una caída de PostgreSQL responde 503 en lugar de una biblioteca vacía. */
export async function loadArticleListForPage(Astro: AstroGlobal, locale: Locale) {
  try {
    return { articles: await listPublishedArticles(locale), articlesUnavailable: false };
  } catch {
    markUnavailable(Astro.response);
    return { articles: [], articlesUnavailable: true };
  }
}
