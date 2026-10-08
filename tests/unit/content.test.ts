import { describe, expect, it } from 'vitest';
import { homeContent } from '../../src/data/home';
import { redirects } from '../../src/lib/redirects.config';
import { innerPages } from '../../src/data/innerPages';
import { formatPlaceholder, placeholderEnd, placeholderStart } from '../../src/lib/placeholders';

describe('localized home content', () => {
  it('keeps six service pillars in both languages', () => {
    expect(homeContent.es.services.items).toHaveLength(6);
    expect(homeContent.en.services.items).toHaveLength(6);
  });

  it('does not ship unverified migration redirects', () => {
    expect(redirects).toEqual([]);
  });

  it('has a one-to-one localized route for every interior page', () => {
    expect(innerPages.es).toHaveLength(15);
    expect(innerPages.en).toHaveLength(15);
    for (const page of innerPages.es) {
      expect(innerPages.en.some((alternate) => alternate.slug === page.alternateSlug)).toBe(true);
    }
  });

  it('only links related content to declared localized routes', () => {
    for (const locale of ['es', 'en'] as const) {
      const knownPaths = new Set(innerPages[locale].map((page) => `/${locale}/${page.slug}/`));
      for (const page of innerPages[locale]) {
        for (const link of page.related ?? []) expect(knownPaths.has(link.href)).toBe(true);
      }
    }
  });

  it('marks provisional content at the beginning and end in uppercase', () => {
    expect(formatPlaceholder('Dato pendiente', 'es')).toBe('PLACEHOLDER — DATO PENDIENTE — FIN PLACEHOLDER');
    expect(placeholderStart('Borrador médico', 'es')).toBe('INICIO PLACEHOLDER — BORRADOR MÉDICO');
    expect(placeholderEnd('Contenido provisional', 'es')).toBe('FIN PLACEHOLDER — CONTENIDO PROVISIONAL');
  });
});
