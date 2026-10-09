import type { APIRoute } from 'astro';
import { db, hasDatabase } from '@/lib/server/db';
import { hasObjectStorage, uploadMedia } from '@/lib/server/storage';
import { assertSameOrigin } from '@/lib/server/validation';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const maxSize = 8 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
  try {
    assertSameOrigin(request);
    if (!hasObjectStorage()) return Response.json({ error: 'Railway Bucket not configured' }, { status: 503 });
    const form = await request.formData();
    const file = form.get('file');
    const altText = String(form.get('altText') ?? '').trim().slice(0, 180);
    if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size <= 0 || file.size > maxSize) {
      return Response.json({ error: 'Use JPEG, PNG, WebP o AVIF de hasta 8 MB' }, { status: 400 });
    }
    const uploaded = await uploadMedia(file);
    const id = crypto.randomUUID();
    if (hasDatabase()) {
      await db()`INSERT INTO media_assets (id, object_key, url, filename, content_type, size_bytes, alt_text) VALUES (${id}, ${uploaded.key}, ${uploaded.url}, ${file.name}, ${file.type}, ${file.size}, ${altText})`;
    }
    return Response.json({ id, ...uploaded, filename: file.name, altText }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to upload image' }, { status: 400 });
  }
};
