import type { APIRoute } from 'astro';
import { deleteRecord, getRecord, saveRecord } from '@/lib/server/content';
import { databaseUnavailable, errorResponse } from '@/lib/server/http';
import { assertSameOrigin, normalizeRecord } from '@/lib/server/validation';

export const GET: APIRoute = async ({ params }) => {
  try {
    const unavailable = databaseUnavailable();
    if (unavailable) return unavailable;
    const record = await getRecord(params.id!);
    return record ? Response.json(record) : Response.json({ error: 'No encontrado' }, { status: 404 });
  } catch (error) {
    return errorResponse(error, 'No se pudo cargar el registro.');
  }
};

/** Actualiza un registro. `baseUpdatedAt` evita sobrescribir cambios hechos en otra sesión. */
export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    assertSameOrigin(request);
    const unavailable = databaseUnavailable();
    if (unavailable) return unavailable;
    const current = await getRecord(params.id!);
    if (!current) return Response.json({ error: 'Este registro ya no existe. Se recargaron los datos.' }, { status: 409 });
    const { baseUpdatedAt, ...changes } = await request.json() as Record<string, unknown> & { baseUpdatedAt?: string };
    const record = normalizeRecord({ ...current, ...changes, id: params.id });
    return Response.json(await saveRecord(record, { expectedUpdatedAt: typeof baseUpdatedAt === 'string' ? baseUpdatedAt : undefined }));
  } catch (error) {
    return errorResponse(error, 'No se pudo actualizar el registro.');
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    assertSameOrigin(request);
    const unavailable = databaseUnavailable();
    if (unavailable) return unavailable;
    await deleteRecord(params.id!);
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error, 'No se pudo eliminar el registro.');
  }
};
