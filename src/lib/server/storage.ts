import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
  });
  return storageClient;
}

export async function uploadMedia(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const key = `media/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  await storage().send(new PutObjectCommand({
    Bucket: process.env.BUCKET!,
    Key: key,
    Body: new Uint8Array(await file.arrayBuffer()),
    ContentType: file.type,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return { key, url: `/api/media/${key}` };
}

export async function readMedia(key: string) {
  return storage().send(new GetObjectCommand({ Bucket: process.env.BUCKET!, Key: key }));
}

export async function removeMedia(key: string) {
  await storage().send(new DeleteObjectCommand({ Bucket: process.env.BUCKET!, Key: key }));
}
