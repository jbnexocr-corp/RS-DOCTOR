import { innerPages } from '@/data/innerPages';
import { serviceDetails } from '@/data/serviceDetails';
import type { EditorialRecord } from './repository';

const pageCollection = (kind: string): EditorialRecord['collection'] => (kind === 'articles' ? 'articles' : kind === 'resource' ? 'resources' : 'pages');

/** Contenido inicial del panel, generado a partir de los datos del sitio en ambos idiomas. */
export function buildSeedRecords(now = new Date().toISOString()): EditorialRecord[] {
  return [
    ...serviceDetails.es.map((item) => ({ id: `service-${item.slug}`, collection: 'services' as const, locale: 'es' as const, status: item.reviewStatus, title: item.title, slug: item.slug, summary: item.summary, updatedAt: now, notes: 'La versión en inglés está relacionada mediante alternateSlug.' })),
    ...serviceDetails.en.map((item) => ({ id: `service-en-${item.slug}`, collection: 'services' as const, locale: 'en' as const, status: item.reviewStatus, title: item.title, slug: item.slug, summary: item.summary, updatedAt: now, notes: 'English counterpart prepared for human review.' })),
    ...innerPages.es.map((item) => ({ id: `page-${item.slug.replaceAll('/', '-')}`, collection: pageCollection(item.kind), locale: 'es' as const, status: 'draft' as const, title: item.title, slug: item.slug, summary: item.description, updatedAt: now, notes: item.pending ?? '' })),
    ...innerPages.en.map((item) => ({ id: `page-en-${item.slug.replaceAll('/', '-')}`, collection: pageCollection(item.kind), locale: 'en' as const, status: 'draft' as const, title: item.title, slug: item.slug, summary: item.description, updatedAt: now, notes: item.pending ?? '' })),
  ];
}
