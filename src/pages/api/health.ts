import type { APIRoute } from 'astro';
import { db, hasDatabase } from '@/lib/server/db';
import { hasObjectStorage } from '@/lib/server/storage';

export const GET: APIRoute = async () => {
  try {
    if (hasDatabase()) await db()`SELECT 1`;
    return Response.json({
      ok: true,
      database: hasDatabase() ? 'connected' : 'not-configured',
      objectStorage: hasObjectStorage() ? 'configured' : 'not-configured',
    });
  } catch {
    return Response.json({ ok: false, database: 'unavailable' }, { status: 503 });
  }
};
