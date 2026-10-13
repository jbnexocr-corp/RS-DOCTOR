import type { APIRoute } from 'astro';
import { buildSeedRecords } from '@/lib/admin/seed';
import { seedIfEmpty } from '@/lib/server/content';
import { databaseUnavailable, errorResponse } from '@/lib/server/http';
import { assertSameOrigin } from '@/lib/server/validation';

/** Importa el contenido inicial solo si la base nunca fue inicializada. */
export const POST: APIRoute = async ({ request }) => {
  try {
    assertSameOrigin(request);
    const unavailable = databaseUnavailable();
    if (unavailable) return unavailable;
    return Response.json({ seeded: await seedIfEmpty(buildSeedRecords()) });
  } catch (error) {
    return errorResponse(error, 'No se pudo importar el contenido inicial.');
  }
};
