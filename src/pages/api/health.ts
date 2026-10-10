import type { APIRoute } from 'astro';
import { db, hasDatabase } from '@/lib/server/db';
import { hasObjectStorage } from '@/lib/server/storage';

type HealthResult = { payload: { ok: boolean; database: string; objectStorage?: string }; status: number };
let cached: (HealthResult & { expiresAt: number }) | undefined;
let pending: Promise<HealthResult> | undefined;

export const GET: APIRoute = async () => {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return Response.json(cached.payload, { status: cached.status });
  pending ??= (async () => {
    try {
      if (hasDatabase()) await db()`SELECT 1`;
      return {
        status: 200,
        payload: {
          ok: true,
          database: hasDatabase() ? 'connected' : 'not-configured',
          objectStorage: hasObjectStorage() ? 'configured' : 'not-configured',
        },
      };
    } catch {
      return { status: 503, payload: { ok: false, database: 'unavailable' } };
    }
  })().finally(() => { pending = undefined; });
  const result = await pending;
  cached = { ...result, expiresAt: Date.now() + 10_000 };
  return Response.json(result.payload, { status: result.status });
};
