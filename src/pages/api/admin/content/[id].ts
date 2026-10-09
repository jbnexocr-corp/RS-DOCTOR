import type { APIRoute } from 'astro';
import { deleteRecord, getRecord, upsertRecord } from '@/lib/server/content';
import { assertSameOrigin, normalizeRecord } from '@/lib/server/validation';

export const GET: APIRoute = async ({ params }) => {
  const record = await getRecord(params.id!);
  return record ? Response.json(record) : Response.json({ error: 'Not found' }, { status: 404 });
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    assertSameOrigin(request);
    const current = await getRecord(params.id!);
    if (!current) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(await upsertRecord(normalizeRecord({ ...current, ...await request.json(), id: params.id })));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to update record' }, { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    assertSameOrigin(request);
    await deleteRecord(params.id!);
    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to delete record' }, { status: 400 });
  }
};
