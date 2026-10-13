import type { APIRoute } from 'astro';
import { buildSeedRecords } from '@/lib/admin/seed';
import { getAdminState, replaceAllRecords } from '@/lib/server/content';
import { databaseUnavailable, errorResponse } from '@/lib/server/http';
import { assertSameOrigin, normalizeRecord, normalizeSettings, ValidationError } from '@/lib/server/validation';

export const GET: APIRoute = async () => {
  try {
    const unavailable = databaseUnavailable();
    if (unavailable) return unavailable;
    return Response.json(await getAdminState());
  } catch (error) {
    return errorResponse(error, 'No se pudo conectar con PostgreSQL.');
  }
};

/**
 * Reemplazo completo, reservado para dos acciones explícitas del panel:
 * importar un respaldo (`mode: "import"`) o volver al contenido inicial (`mode: "reset"`).
 * Las ediciones normales usan /api/admin/content registro por registro.
 */
export const PUT: APIRoute = async ({ request }) => {
  try {
    assertSameOrigin(request);
    const unavailable = databaseUnavailable();
    if (unavailable) return unavailable;
    const input = await request.json() as { mode?: string; records?: unknown; settings?: unknown };
    if (input.mode === 'reset') {
      await replaceAllRecords(buildSeedRecords(), 'Contenido inicial restaurado');
    } else if (input.mode === 'import') {
      if (!Array.isArray(input.records)) throw new ValidationError('El respaldo no contiene registros.');
      const records = input.records.map(normalizeRecord);
      const settings = input.settings && typeof input.settings === 'object' ? normalizeSettings(input.settings) : undefined;
      await replaceAllRecords(records, `Respaldo importado (${records.length} registros)`, settings);
    } else {
      throw new ValidationError('Operación no válida.');
    }
    return Response.json(await getAdminState());
  } catch (error) {
    return errorResponse(error, 'No se pudo reemplazar el contenido.');
  }
};
