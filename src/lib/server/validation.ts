import type { EditorialRecord } from '@/lib/admin/repository';

const collections = new Set(['pages', 'services', 'articles', 'team', 'locations', 'resources', 'media']);
const locales = new Set(['es', 'en']);
const statuses = new Set(['draft', 'pending-medical-review', 'approved', 'published', 'archived']);

const text = (value: unknown, max = 20_000) => String(value ?? '').trim().slice(0, max);

export class ValidationError extends Error {}
export class OriginError extends ValidationError {}

export function normalizeRecord(input: unknown): EditorialRecord {
  if (!input || typeof input !== 'object') throw new ValidationError('Registro de contenido no válido.');
  const value = input as Record<string, unknown>;
  const collection = text(value.collection, 40);
  const locale = text(value.locale, 5);
  const status = text(value.status, 40);
  const title = text(value.title, 120);
  const slug = text(value.slug, 180).toLowerCase();
  const reviewDate = text(value.reviewDate, 10);
  const updatedAt = new Date(String(value.updatedAt ?? ''));
  if (!collections.has(collection) || !locales.has(locale) || !statuses.has(status)) throw new ValidationError('Colección, idioma o estado no válido.');
  if (!title) throw new ValidationError('El título es obligatorio.');
  if (!/^[a-z0-9]+(?:[a-z0-9\-/]*[a-z0-9])?$/.test(slug)) throw new ValidationError(`El slug “${slug || '(vacío)'}” solo puede tener minúsculas, números, guiones y barras.`);
  if (collection === 'articles' && slug.includes('/')) throw new ValidationError('El slug de un artículo no puede contener “/”.');
  if (reviewDate && (!/^\d{4}-\d{2}-\d{2}$/.test(reviewDate) || Number.isNaN(Date.parse(reviewDate)))) throw new ValidationError('La fecha de revisión no es válida.');
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
    reviewDate,
    sources: text(value.sources, 20_000),
    altText: text(value.altText, 180),
    imageData: text(value.imageData, 2_000),
    imageKey: text(value.imageKey, 1_000),
    updatedAt: Number.isNaN(updatedAt.getTime()) ? new Date().toISOString() : updatedAt.toISOString(),
  };
}

/** Detecta dos registros con la misma colección, idioma y slug antes de tocar la base de datos. */
export function assertUniqueSlugs(records: EditorialRecord[]) {
  const seen = new Map<string, string>();
  for (const record of records) {
    const key = `${record.collection}:${record.locale}:${record.slug}`;
    const previous = seen.get(key);
    if (previous) throw new ValidationError(`“${record.title}” y “${previous}” usan el mismo slug (${record.slug}) en la misma colección e idioma.`);
    seen.set(key, record.title);
  }
}

const settingStrings = new Set(['siteName', 'descriptor', 'siteUrl', 'defaultLocale', 'whatsapp', 'phone', 'recipient', 'analyticsId']);
const settingFlags = new Set(['privacyApproved', 'termsApproved', 'imageRights', 'brandApproved', 'medicalWorkflow', 'searchConsole']);

export function normalizeSettings(input: unknown) {
  if (!input || typeof input !== 'object') return {};
  const settings: Record<string, string | boolean> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (settingStrings.has(key)) settings[key] = text(value, 300);
    else if (settingFlags.has(key)) settings[key] = value === true;
  }
  return settings;
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) throw new OriginError('Solicitud de otro origen rechazada.');
}
