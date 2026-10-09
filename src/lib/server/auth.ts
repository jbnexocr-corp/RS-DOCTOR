import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'rs_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

const equal = (left: Buffer, right: Buffer) => left.length === right.length && timingSafeEqual(left, right);
const adminUsername = () => process.env.ADMIN_USERNAME || '';
const adminPasswordHash = () => process.env.ADMIN_PASSWORD_HASH || '';
const adminSessionSecret = () => process.env.ADMIN_SESSION_SECRET || '';

export function hashAdminPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt:${salt.toString('base64url')}:${hash.toString('base64url')}`;
}

export function isAdminAuthConfigured() {
  return Boolean(adminUsername() && adminPasswordHash().startsWith('scrypt:') && adminSessionSecret().length >= 32);
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = adminUsername();
  const encoded = adminPasswordHash();
  const parts = encoded.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;

  const providedUsername = Buffer.from(username);
  const storedUsername = Buffer.from(expectedUsername);
  const usernameMatches = equal(providedUsername, storedUsername);

  try {
    const salt = Buffer.from(parts[1], 'base64url');
    const storedHash = Buffer.from(parts[2], 'base64url');
    const candidateHash = scryptSync(password, salt, storedHash.length);
    return usernameMatches && equal(candidateHash, storedHash);
  } catch {
    return false;
  }
}

export function createAdminSession(username: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ username, expiresAt })).toString('base64url');
  const signature = createHmac('sha256', adminSessionSecret()).update(payload).digest('base64url');
  return { token: `${payload}.${signature}`, maxAge: SESSION_TTL_SECONDS };
}

export function verifyAdminSession(token?: string) {
  if (!token || !isAdminAuthConfigured()) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = createHmac('sha256', adminSessionSecret()).update(payload).digest();
  const received = Buffer.from(signature, 'base64url');
  if (!equal(expected, received)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { username?: string; expiresAt?: number };
    return data.username === adminUsername() && Number(data.expiresAt) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export const adminCookieOptions = (maxAge = SESSION_TTL_SECONDS) => ({
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge,
});
