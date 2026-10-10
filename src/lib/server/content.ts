import { db, hasDatabase } from './db';
import type { EditorialRecord } from '@/lib/admin/repository';

type CacheEntry<T> = { value: T; freshUntil: number; staleUntil: number };
const publicCache = new Map<string, CacheEntry<unknown>>();
const pendingLoads = new Map<string, Promise<unknown>>();
const PUBLIC_TTL_MS = 60_000;
const STALE_TTL_MS = 60 * 60_000;
const MAX_CACHE_ENTRIES = 250;

function storeCacheEntry<T>(key: string, value: T, now: number) {
  if (!publicCache.has(key) && publicCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = publicCache.keys().next().value;
    if (oldestKey) publicCache.delete(oldestKey);
  }
  publicCache.set(key, { value, freshUntil: now + PUBLIC_TTL_MS, staleUntil: now + STALE_TTL_MS });
}

async function cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const entry = publicCache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.freshUntil > now) return entry.value;
  const pending = pendingLoads.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const load = loader()
    .then((value) => {
      storeCacheEntry(key, value, now);
      return value;
    })
    .catch((error) => {
      if (entry && entry.staleUntil > now) return entry.value;
      throw error;
    })
    .finally(() => pendingLoads.delete(key));
  pendingLoads.set(key, load);
  return load;
}

export function invalidateContentCache() {
  publicCache.clear();
}

const mapRecord = (row: Record<string, unknown>): EditorialRecord => ({
  id: String(row.id),
  collection: row.collection as EditorialRecord['collection'],
  locale: row.locale as EditorialRecord['locale'],
  status: row.status as EditorialRecord['status'],
  title: String(row.title),
  slug: String(row.slug),
  summary: String(row.summary ?? ''),
  body: String(row.body ?? ''),
  notes: String(row.notes ?? ''),
  author: String(row.author ?? ''),
  medicalReviewer: String(row.medical_reviewer ?? ''),
  reviewDate: row.review_date ? new Date(String(row.review_date)).toISOString().slice(0, 10) : '',
  sources: String(row.sources ?? ''),
  altText: String(row.alt_text ?? ''),
  imageData: String(row.image_url ?? ''),
  imageKey: String(row.image_key ?? ''),
  updatedAt: new Date(String(row.updated_at)).toISOString(),
});

export async function listRecords(filters: { collection?: string; locale?: string; status?: string } = {}) {
  if (!hasDatabase()) return [];
  const sql = db();
  const rows = await sql`
    SELECT * FROM content_records
    WHERE (${filters.collection ?? null}::text IS NULL OR collection = ${filters.collection ?? null})
      AND (${filters.locale ?? null}::text IS NULL OR locale = ${filters.locale ?? null})
      AND (${filters.status ?? null}::text IS NULL OR status = ${filters.status ?? null})
    ORDER BY updated_at DESC
  `;
  return rows.map((row) => mapRecord(row));
}

export async function getRecord(id: string) {
  const rows = await db()`SELECT * FROM content_records WHERE id = ${id} LIMIT 1`;
  return rows[0] ? mapRecord(rows[0]) : undefined;
}

export async function getPublishedArticle(locale: 'es' | 'en', slug: string) {
  if (!hasDatabase()) return undefined;
  return cached(`article:${locale}:${slug}`, async () => {
    const rows = await db()`
      SELECT id, collection, locale, status, title, slug, summary, body, author,
        medical_reviewer, review_date, sources, alt_text, image_url, updated_at
      FROM content_records
      WHERE collection = 'articles' AND locale = ${locale} AND slug = ${slug} AND status = 'published'
      LIMIT 1
    `;
    return rows[0] ? mapRecord(rows[0]) : undefined;
  });
}

export async function listPublishedArticles(locale?: 'es' | 'en') {
  if (!hasDatabase()) return [];
  return cached(`article-list:${locale ?? 'all'}`, async () => {
    const sql = db();
    const rows = await sql`
      SELECT id, collection, locale, status, title, slug, summary, author,
        medical_reviewer, review_date, alt_text, image_url, updated_at
      FROM content_records
      WHERE collection = 'articles' AND status = 'published'
        AND (${locale ?? null}::text IS NULL OR locale = ${locale ?? null})
      ORDER BY updated_at DESC
    `;
    return rows.map((row) => mapRecord(row));
  });
}

export async function upsertRecord(record: EditorialRecord) {
  const rows = await db()`
    INSERT INTO content_records (
      id, collection, locale, status, title, slug, summary, body, notes, author,
      medical_reviewer, review_date, sources, alt_text, image_url, image_key, updated_at
    ) VALUES (
      ${record.id}, ${record.collection}, ${record.locale}, ${record.status}, ${record.title}, ${record.slug},
      ${record.summary}, ${record.body ?? ''}, ${record.notes}, ${record.author ?? ''},
      ${record.medicalReviewer ?? ''}, ${record.reviewDate || null}, ${record.sources ?? ''},
      ${record.altText ?? ''}, ${record.imageData ?? ''}, ${record.imageKey ?? ''}, now()
    )
    ON CONFLICT (id) DO UPDATE SET
      collection = excluded.collection, locale = excluded.locale, status = excluded.status,
      title = excluded.title, slug = excluded.slug, summary = excluded.summary, body = excluded.body,
      notes = excluded.notes, author = excluded.author, medical_reviewer = excluded.medical_reviewer,
      review_date = excluded.review_date, sources = excluded.sources, alt_text = excluded.alt_text,
      image_url = excluded.image_url, image_key = excluded.image_key, updated_at = now()
    RETURNING *
  `;
  invalidateContentCache();
  return mapRecord(rows[0]);
}

export async function deleteRecord(id: string) {
  await db()`DELETE FROM content_records WHERE id = ${id}`;
  invalidateContentCache();
}
