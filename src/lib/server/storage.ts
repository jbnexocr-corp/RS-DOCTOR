import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { Agent } from 'node:https';
import sharp from 'sharp';

let storageClient: S3Client | undefined;

export const hasObjectStorage = () => Boolean(
  process.env.BUCKET && process.env.ACCESS_KEY_ID && process.env.SECRET_ACCESS_KEY && process.env.ENDPOINT,
);

function storage() {
  if (!hasObjectStorage()) throw new Error('Railway Bucket credentials are not configured');
  storageClient ??= new S3Client({
    endpoint: process.env.ENDPOINT,
    region: process.env.REGION || 'auto',
    forcePathStyle: process.env.BUCKET_FORCE_PATH_STYLE === 'true',
    maxAttempts: 2,
    requestHandler: new NodeHttpHandler({ connectionTimeout: 3_000, requestTimeout: 15_000, httpsAgent: new Agent({ keepAlive: true, maxSockets: 16 }) }),
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
  });
  return storageClient;
}

export class InvalidImageError extends Error {}

export async function uploadMedia(file: File) {
  const input = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(input, { limitInputPixels: 40_000_000 })
    .rotate()
    .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer()
    .catch(() => { throw new InvalidImageError('El archivo no es una imagen válida.'); });
  const key = `media/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.webp`;
  await storage().send(new PutObjectCommand({
    Bucket: process.env.BUCKET!,
    Key: key,
    Body: optimized,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return { key, url: `/api/media/${key}`, size: optimized.byteLength, contentType: 'image/webp' };
}

export async function readMedia(key: string) {
  return storage().send(new GetObjectCommand({ Bucket: process.env.BUCKET!, Key: key }));
}

export async function removeMedia(key: string) {
  await storage().send(new DeleteObjectCommand({ Bucket: process.env.BUCKET!, Key: key }));
}
