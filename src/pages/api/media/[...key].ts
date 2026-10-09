import type { APIRoute } from 'astro';
import { readMedia } from '@/lib/server/storage';

export const GET: APIRoute = async ({ params }) => {
  try {
    const key = params.key;
    if (!key || key.includes('..')) return new Response('Not found', { status: 404 });
    const object = await readMedia(key);
    if (!object.Body) return new Response('Not found', { status: 404 });
    const bytes = await object.Body.transformToByteArray();
    const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    return new Response(body, {
      headers: {
        'Content-Type': object.ContentType || 'application/octet-stream',
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': object.CacheControl || 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
