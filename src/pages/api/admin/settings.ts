import type { APIRoute } from 'astro';
import { saveSettings } from '@/lib/server/content';
import { databaseUnavailable, errorResponse } from '@/lib/server/http';
import { assertSameOrigin, normalizeSettings } from '@/lib/server/validation';

export const PUT: APIRoute = async ({ request }) => {
  try {
    assertSameOrigin(request);
    const unavailable = databaseUnavailable();
    if (unavailable) return unavailable;
    await saveSettings(normalizeSettings(await request.json()));
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error, 'No se pudo guardar la configuración.');
  }
};
