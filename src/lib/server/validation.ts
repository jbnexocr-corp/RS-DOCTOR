import type { EditorialRecord } from '@/lib/admin/repository';

const collections = new Set(['pages', 'services', 'articles', 'team', 'locations', 'resources', 'media']);
const locales = new Set(['es', 'en']);
const statuses = new Set(['draft', 'pending-medical-review', 'approved', 'published', 'archived']);

const text = (value: unknown, max = 20_000) => String(value ?? '').trim().slice(0, max);

export function normalizeRecord(input: unknown): EditorialRecord {
  if (!input || typeof input !== 'object') throw new Error('Invalid content record');
  const value = input as Record<string, unknown>;
  const collection = text(value.collection, 40);
  const locale = text(value.locale, 5);
  const status = text(value.status, 40);
  const title = text(value.title, 120);
  const slug = text(value.slug, 180).toLowerCase();
  if (!collections.has(collection) || !locales.has(locale) || !statuses.has(status)) throw new Error('Invalid content classification');
  if (!title || !/^[a-z0-9]+(?:[a-z0-9\-/]*[a-z0-9])?$/.test(slug)) throw new Error('Title and slug are required');
  return {
    id: text(value.id, 180) || crypto.randomUUID(),
    collection: collection as EditorialRecord['collection'],
    locale: locale as EditorialRecord['locale'],
    status: status as EditorialRecord['status'],
    title,
    slug,
    summary: text(value.summary, 5_000),
    body: text(value.body, 100_000),
    notes: text(value.notes, 10_000),
    author: text(value.author, 120),
    medicalReviewer: text(value.medicalReviewer, 120),
    reviewDate: text(value.reviewDate, 10),
    sources: text(value.sources, 20_000),
    altText: text(value.altText, 180),
    imageData: text(value.imageData, 2_000),
    imageKey: text(value.imageKey, 1_000),
    updatedAt: new Date().toISOString(),
  };
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) throw new Error('Cross-origin request rejected');
}
