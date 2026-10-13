import type postgres from 'postgres';
import { db, hasDatabase } from './db';
import { hasObjectStorage, removeMedia } from './storage';
import { assertUniqueSlugs, ValidationError } from './validation';
import type { EditorialRecord } from '@/lib/admin/repository';

type Transaction = postgres.TransactionSql<Record<string, never>>;

type CacheEntry<T> = { value: T; freshUntil: number; staleUntil: number };
const publicCache = new Map<string, CacheEntry<unknown>>();
const pendingLoads = new Map<string, Promise<unknown>>();
const PUBLIC_TTL_MS = 60_000;
const STALE_TTL_MS = 60 * 60_000;
const MAX_CACHE_ENTRIES = 250;
const MAX_AUDIT_ENTRIES = 500;
const SEEDED_MARKER = 'system:seededAt';
let cacheGeneration = 0;

export class ConflictError extends Error {}

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

  // Una carga iniciada antes de invalidar la caché no debe volver a guardar datos viejos.
  const generation = cacheGeneration;
  const load = loader()
    .then((value) => {
      if (generation === cacheGeneration) storeCacheEntry(key, value, now);
      return value;
    })
    .catch((error) => {
      if (entry && entry.staleUntil > now) return entry.value;
      throw error;
    })
    .finally(() => { if (pendingLoads.get(key) === load) pendingLoads.delete(key); });
  pendingLoads.set(key, load);
  return load;
}

export function invalidateContentCache() {
  cacheGeneration += 1;
  publicCache.clear();
  pendingLoads.clear();
}

const toIso = (value: unknown) => (value instanceof Date ? value : new Date(String(value))).toISOString();

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
  reviewDate: row.review_date ? toIso(row.review_date).slice(0, 10) : '',
  sources: String(row.sources ?? ''),
  altText: String(row.alt_text ?? ''),
  imageData: String(row.image_url ?? ''),
  imageKey: String(row.image_key ?? ''),
  updatedAt: toIso(row.updated_at),
});

const toRow = (record: EditorialRecord, updatedAt: Date) => ({
  id: record.id,
  collection: record.collection,
  locale: record.locale,
  status: record.status,
  title: record.title,
  slug: record.slug,
  summary: record.summary,
  body: record.body ?? '',
  notes: record.notes,
  author: record.author ?? '',
  medical_reviewer: record.medicalReviewer ?? '',
  review_date: record.reviewDate || null,
  sources: record.sources ?? '',
  alt_text: record.altText ?? '',
  image_url: record.imageData ?? '',
  image_key: record.imageKey ?? '',
  updated_at: updatedAt,
});
const rowColumns = ['id', 'collection', 'locale', 'status', 'title', 'slug', 'summary', 'body', 'notes', 'author', 'medical_reviewer', 'review_date', 'sources', 'alt_text', 'image_url', 'image_key', 'updated_at'] as const;

/** Traduce la violación del índice único (colección, idioma, slug) a un mensaje comprensible. */
function friendlyDatabaseError(error: unknown) {
  if ((error as { code?: string })?.code === '23505') return new ValidationError('Ya existe un contenido con ese slug en la misma colección e idioma.');
  return error;
}

async function recordAudit(transaction: Transaction, message: string) {
  await transaction`INSERT INTO audit_log (id, message) VALUES (${crypto.randomUUID()}, ${message.slice(0, 2_000)})`;
  await transaction`DELETE FROM audit_log WHERE id IN (SELECT id FROM audit_log ORDER BY created_at DESC OFFSET ${MAX_AUDIT_ENTRIES})`;
}

/** Elimina del Bucket las imágenes que ya no usa ningún registro. Nunca interrumpe la operación principal. */
export async function cleanupUnusedMedia(keys: Array<string | undefined>) {
  const candidates = [...new Set(keys.filter((key): key is string => Boolean(key && key.startsWith('media/'))))];
  if (!candidates.length || !hasDatabase()) return;
  const sql = db();
  for (const key of candidates) {
    try {
      const [inUse] = await sql`SELECT 1 FROM content_records WHERE image_key = ${key} LIMIT 1`;
      if (inUse) continue;
      if (hasObjectStorage()) await removeMedia(key);
      await sql`DELETE FROM media_assets WHERE object_key = ${key}`;
    } catch (error) {
      console.warn(`[media] No se pudo limpiar ${key}:`, error instanceof Error ? error.message : error);
    }
  }
}

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

/**
 * Crea o actualiza un único registro. Si se indica expectedUpdatedAt y el
 * registro cambió en otra sesión, se rechaza con ConflictError en lugar de
 * sobrescribir el trabajo de otra persona.
 */
export async function saveRecord(record: EditorialRecord, options: { expectedUpdatedAt?: string } = {}) {
  let previousImageKey = '';
  let saved: EditorialRecord;
  try {
    saved = await db().begin(async (transaction) => {
      const [current] = await transaction`SELECT title, image_key, updated_at FROM content_records WHERE id = ${record.id} FOR UPDATE`;
      if (options.expectedUpdatedAt) {
        if (!current) throw new ConflictError('Este registro fue eliminado en otra sesión. Se recargaron los datos.');
        if (toIso(current.updated_at) !== options.expectedUpdatedAt) throw new ConflictError('Este registro cambió en otra sesión. Se recargaron los datos; revisa y vuelve a guardar.');
      }
      previousImageKey = String(current?.image_key ?? '');
      const row = toRow(record, new Date());
      const [result] = await transaction`
        INSERT INTO content_records ${transaction(row, ...rowColumns)}
        ON CONFLICT (id) DO UPDATE SET
          collection = excluded.collection, locale = excluded.locale, status = excluded.status,
          title = excluded.title, slug = excluded.slug, summary = excluded.summary, body = excluded.body,
          notes = excluded.notes, author = excluded.author, medical_reviewer = excluded.medical_reviewer,
          review_date = excluded.review_date, sources = excluded.sources, alt_text = excluded.alt_text,
          image_url = excluded.image_url, image_key = excluded.image_key, updated_at = excluded.updated_at
        RETURNING *
      `;
      await recordAudit(transaction, `${current ? 'Actualizado' : 'Creado'}: ${record.title}`);
      return mapRecord(result);
    });
  } catch (error) {
    throw friendlyDatabaseError(error);
  }
  invalidateContentCache();
  if (previousImageKey && previousImageKey !== saved.imageKey) await cleanupUnusedMedia([previousImageKey]);
  return saved;
}

export async function deleteRecord(id: string) {
  const deleted = await db().begin(async (transaction) => {
    const [row] = await transaction`DELETE FROM content_records WHERE id = ${id} RETURNING title, image_key`;
    if (row) await recordAudit(transaction, `Eliminado: ${String(row.title)}`);
    return row;
  });
  invalidateContentCache();
  if (deleted?.image_key) await cleanupUnusedMedia([String(deleted.image_key)]);
  return Boolean(deleted);
}

export async function getAdminState() {
  const sql = db();
  const [records, settingsRows, auditRows] = await Promise.all([
    listRecords(),
    sql`SELECT key, value FROM site_settings`,
    sql`SELECT id, message, created_at FROM audit_log ORDER BY created_at DESC LIMIT 100`,
  ]);
  let seeded = settingsRows.some((row) => row.key === SEEDED_MARKER);
  if (!seeded && records.length) {
    await sql`INSERT INTO site_settings (key, value) VALUES (${SEEDED_MARKER}, ${sql.json(new Date().toISOString())}) ON CONFLICT (key) DO NOTHING`;
    seeded = true;
  }
  const settings = Object.fromEntries(settingsRows.filter((row) => !String(row.key).startsWith('system:')).map((row) => [String(row.key), row.value]));
  const audit = auditRows.map((row) => ({ id: String(row.id), message: String(row.message), at: toIso(row.created_at) }));
  return { version: 3, records, settings, audit, seeded };
}

export async function saveSettings(settings: Record<string, string | boolean>) {
  await db().begin(async (transaction) => {
    await transaction`DELETE FROM site_settings WHERE key NOT LIKE 'system:%'`;
    for (const [key, value] of Object.entries(settings)) {
      await transaction`INSERT INTO site_settings (key, value) VALUES (${key}, ${transaction.json(value)})`;
    }
    await recordAudit(transaction, 'Configuración actualizada');
  });
}

/**
 * Reemplaza todos los registros (importación de respaldo o restablecimiento).
 * Es la única operación masiva y solo se ejecuta por una acción explícita.
 */
export async function replaceAllRecords(records: EditorialRecord[], message: string, settings?: Record<string, string | boolean>) {
  assertUniqueSlugs(records);
  let previousKeys: string[] = [];
  try {
    await db().begin(async (transaction) => {
      previousKeys = (await transaction`SELECT image_key FROM content_records WHERE image_key <> ''`).map((row) => String(row.image_key));
      await transaction`DELETE FROM content_records`;
      if (records.length) {
        const rows = records.map((record) => toRow(record, new Date(record.updatedAt)));
        await transaction`INSERT INTO content_records ${transaction(rows, ...rowColumns)}`;
      }
      if (settings) {
        await transaction`DELETE FROM site_settings WHERE key NOT LIKE 'system:%'`;
        for (const [key, value] of Object.entries(settings)) {
          await transaction`INSERT INTO site_settings (key, value) VALUES (${key}, ${transaction.json(value)})`;
        }
      }
      await transaction`INSERT INTO site_settings (key, value) VALUES (${SEEDED_MARKER}, ${transaction.json(new Date().toISOString())}) ON CONFLICT (key) DO NOTHING`;
      await recordAudit(transaction, message);
    });
  } catch (error) {
    throw friendlyDatabaseError(error);
  }
  invalidateContentCache();
  const keptKeys = new Set(records.map((record) => record.imageKey));
  await cleanupUnusedMedia(previousKeys.filter((key) => !keptKeys.has(key)));
}

/** Importa el contenido inicial una sola vez, aunque dos pestañas lo pidan a la vez. */
export async function seedIfEmpty(records: EditorialRecord[]) {
  const seeded = await db().begin(async (transaction) => {
    await transaction`SELECT pg_advisory_xact_lock(724501)`;
    const [marker] = await transaction`SELECT 1 FROM site_settings WHERE key = ${SEEDED_MARKER}`;
    const [existing] = await transaction`SELECT 1 FROM content_records LIMIT 1`;
    if (marker || existing) return false;
    if (records.length) {
      await transaction`INSERT INTO content_records ${transaction(records.map((record) => toRow(record, new Date(record.updatedAt))), ...rowColumns)}`;
    }
    await transaction`INSERT INTO site_settings (key, value) VALUES (${SEEDED_MARKER}, ${transaction.json(new Date().toISOString())})`;
    await recordAudit(transaction, 'Contenido inicial importado a PostgreSQL');
    return true;
  });
  if (seeded) invalidateContentCache();
  return seeded;
}
