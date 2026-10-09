import type { APIRoute } from 'astro';
import { listRecords, upsertRecord } from '@/lib/server/content';
import { assertSameOrigin, normalizeRecord } from '@/lib/server/validation';

export const GET: APIRoute = async () => Response.json(await listRecords());

export const POST: APIRoute = async ({ request }) => {
  try {
    assertSameOrigin(request);
    return Response.json(await upsertRecord(normalizeRecord(await request.json())), { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to create record' }, { status: 400 });
  }
};
