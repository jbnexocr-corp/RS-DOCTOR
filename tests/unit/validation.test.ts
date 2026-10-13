import { describe, expect, it } from 'vitest';
import { assertUniqueSlugs, normalizeRecord, normalizeSettings, ValidationError } from '../../src/lib/server/validation';
import { buildSeedRecords } from '../../src/lib/admin/seed';

const base = { collection: 'articles', locale: 'es', status: 'draft', title: 'Título', slug: 'mi-articulo', summary: '', notes: '' };

describe('admin record validation', () => {
  it('normalizes a valid record and keeps a valid updatedAt', () => {
    const record = normalizeRecord({ ...base, slug: 'Mi-Articulo', updatedAt: '2025-01-02T03:04:05.000Z' });
    expect(record.slug).toBe('mi-articulo');
    expect(record.updatedAt).toBe('2025-01-02T03:04:05.000Z');
  });

  it('rejects slugs, dates and classifications that would break public routes', () => {
    expect(() => normalizeRecord({ ...base, slug: 'a/b' })).toThrow(ValidationError);
    expect(() => normalizeRecord({ ...base, slug: 'con espacios' })).toThrow(ValidationError);
    expect(() => normalizeRecord({ ...base, reviewDate: 'ayer' })).toThrow(ValidationError);
    expect(() => normalizeRecord({ ...base, status: 'borrado' })).toThrow(ValidationError);
    expect(normalizeRecord({ ...base, collection: 'pages', slug: 'embarazo/recursos' }).slug).toBe('embarazo/recursos');
  });

  it('detects duplicate slugs within the same collection and locale only', () => {
    const one = normalizeRecord({ ...base, id: '1' });
    expect(() => assertUniqueSlugs([one, normalizeRecord({ ...base, id: '2' })])).toThrow(/mismo slug/);
    expect(() => assertUniqueSlugs([one, normalizeRecord({ ...base, id: '3', locale: 'en' })])).not.toThrow();
  });

  it('keeps only known settings with the expected types', () => {
    expect(normalizeSettings({ siteUrl: ' https://x.com ', privacyApproved: true, termsApproved: 'true', hacker: 'x' }))
      .toEqual({ siteUrl: 'https://x.com', privacyApproved: true, termsApproved: false });
  });

  it('builds a seed with unique ids and slugs in both languages', () => {
    const seed = buildSeedRecords('2026-01-01T00:00:00.000Z').map((record) => normalizeRecord(record));
    expect(new Set(seed.map((record) => record.id)).size).toBe(seed.length);
    expect(seed.some((record) => record.locale === 'en' && record.collection === 'pages')).toBe(true);
    expect(() => assertUniqueSlugs(seed)).not.toThrow();
  });
});
