import type { APIRoute } from 'astro';
import { cleanupUnusedMedia } from '@/lib/server/content';
import { db, hasDatabase } from '@/lib/server/db';
import { errorResponse } from '@/lib/server/http';
import { hasObjectStorage, InvalidImageError, removeMedia, uploadMedia } from '@/lib/server/storage';
import { assertSameOrigin } from '@/lib/server/validation';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const maxSize = 8 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
  try {
    assertSameOrigin(request);
    if (!hasObjectStorage()) return Response.json({ error: 'Railway Bucket no está configurado.' }, { status: 503 });
    const form = await request.formData();
    const file = form.get('file');
    const altText = String(form.get('altText') ?? '').trim().slice(0, 180);
    if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size <= 0 || file.size > maxSize) {
      return Response.json({ error: 'Use JPEG, PNG, WebP o AVIF de hasta 8 MB.' }, { status: 400 });
    }
    let uploaded: Awaited<ReturnType<typeof uploadMedia>>;
    try {
      uploaded = await uploadMedia(file);
    } catch (error) {
      if (error instanceof InvalidImageError) return Response.json({ error: error.message }, { status: 400 });
      throw error;
    }
    const id = crypto.randomUUID();
    if (hasDatabase()) {
      try {
        await db()`INSERT INTO media_assets (id, object_key, url, filename, content_type, size_bytes, alt_text) VALUES (${id}, ${uploaded.key}, ${uploaded.url}, ${file.name.slice(0, 255)}, ${uploaded.contentType}, ${uploaded.size}, ${altText})`;
      } catch (error) {
        await removeMedia(uploaded.key).catch(() => undefined);
        throw error;
      }
    }
    return Response.json({ id, ...uploaded, filename: file.name, altText }, { status: 201 });
  } catch (error) {
    return errorResponse(error, 'No se pudo subir la imagen.');
  }
};

/** Descarta una imagen recién subida cuyo registro no llegó a guardarse. Solo borra si nadie la usa. */
export const DELETE: APIRoute = async ({ request, url }) => {
  try {
    assertSameOrigin(request);
    const key = url.searchParams.get('key') ?? '';
    if (!/^media\/[\w\-./]+$/.test(key) || key.includes('..')) return Response.json({ error: 'Clave no válida.' }, { status: 400 });
    await cleanupUnusedMedia([key]);
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error, 'No se pudo descartar la imagen.');
  }
};
