import type { APIRoute } from 'astro';
import { listRecords, saveRecord } from '@/lib/server/content';
import { databaseUnavailable, errorResponse } from '@/lib/server/http';
import { assertSameOrigin, normalizeRecord } from '@/lib/server/validation';

export const GET: APIRoute = async () => {
  try {
    return Response.json(await listRecords());
  } catch (error) {
    return errorResponse(error, 'No se pudo cargar el contenido.');
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    assertSameOrigin(request);
    const unavailable = databaseUnavailable();
    if (unavailable) return unavailable;
    return Response.json(await saveRecord(normalizeRecord(await request.json())), { status: 201 });
  } catch (error) {
    return errorResponse(error, 'No se pudo crear el registro.');
  }
};
