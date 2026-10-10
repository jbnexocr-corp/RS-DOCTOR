import type { APIRoute } from 'astro';
import { db, hasDatabase } from '@/lib/server/db';
import { invalidateContentCache, listRecords } from '@/lib/server/content';
import { assertSameOrigin, normalizeRecord } from '@/lib/server/validation';

export const GET: APIRoute = async () => {
  if (!hasDatabase()) return Response.json({ error: 'Database not configured' }, { status: 503 });
  const sql = db();
  const [records, settingsRows, auditRows] = await Promise.all([
    listRecords(),
    sql`SELECT key, value FROM site_settings`,
    sql`SELECT id, message, created_at FROM audit_log ORDER BY created_at DESC LIMIT 100`,
  ]);
  const settings = Object.fromEntries(settingsRows.map((row) => [String(row.key), row.value]));
  const audit = auditRows.map((row) => ({ id: String(row.id), message: String(row.message), at: new Date(String(row.created_at)).toISOString() }));
  return Response.json({ version: 2, records, settings, audit });
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    assertSameOrigin(request);
    if (!hasDatabase()) return Response.json({ error: 'Database not configured' }, { status: 503 });
    const input = await request.json() as { records?: unknown[]; settings?: Record<string, string | boolean>; audit?: Array<{ id?: unknown; message?: unknown; at?: unknown }> };
    const records = (input.records ?? []).map(normalizeRecord);
    const settings = input.settings && typeof input.settings === 'object' ? input.settings : {};
    const audit = Array.isArray(input.audit) ? input.audit.slice(0, 100) : [];
    const sql = db();
    await sql.begin(async (transaction) => {
      await transaction`DELETE FROM content_records`;
      if (records.length) {
        const rows = records.map((record) => ({
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
          updated_at: new Date(),
        }));
        await transaction`INSERT INTO content_records ${transaction(rows, 'id', 'collection', 'locale', 'status', 'title', 'slug', 'summary', 'body', 'notes', 'author', 'medical_reviewer', 'review_date', 'sources', 'alt_text', 'image_url', 'image_key', 'updated_at')}`;
      }
      await transaction`DELETE FROM site_settings`;
      for (const [key, value] of Object.entries(settings)) {
        await transaction`INSERT INTO site_settings (key, value) VALUES (${key}, ${transaction.json(value)})`;
      }
      await transaction`DELETE FROM audit_log`;
      const auditRows = audit
        .map((item) => ({ id: String(item.id || crypto.randomUUID()), message: String(item.message || '').slice(0, 2_000), created_at: item.at ? new Date(String(item.at)) : new Date() }))
        .filter((item) => item.message);
      if (auditRows.length) {
        await transaction`INSERT INTO audit_log ${transaction(auditRows, 'id', 'message', 'created_at')}`;
      }
    });
    invalidateContentCache();
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to save state' }, { status: 400 });
  }
};
