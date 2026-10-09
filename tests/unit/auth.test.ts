import { afterEach, describe, expect, it } from 'vitest';
import { createAdminSession, hashAdminPassword, verifyAdminCredentials, verifyAdminSession } from '../../src/lib/server/auth';

const original = { ...process.env };
afterEach(() => {
  process.env.ADMIN_USERNAME = original.ADMIN_USERNAME;
  process.env.ADMIN_PASSWORD_HASH = original.ADMIN_PASSWORD_HASH;
  process.env.ADMIN_SESSION_SECRET = original.ADMIN_SESSION_SECRET;
});

describe('admin authentication', () => {
  it('verifies scrypt credentials without storing plaintext', () => {
    process.env.ADMIN_USERNAME = 'test-admin';
    process.env.ADMIN_PASSWORD_HASH = hashAdminPassword('A-long-test-password!2026');
    expect(verifyAdminCredentials('test-admin', 'A-long-test-password!2026')).toBe(true);
    expect(verifyAdminCredentials('test-admin', 'incorrect')).toBe(false);
    expect(process.env.ADMIN_PASSWORD_HASH).not.toContain('A-long-test-password!2026');
  });

  it('signs and rejects tampered sessions', () => {
    process.env.ADMIN_USERNAME = 'test-admin';
    process.env.ADMIN_PASSWORD_HASH = hashAdminPassword('A-long-test-password!2026');
    process.env.ADMIN_SESSION_SECRET = 'test-session-secret-with-more-than-32-characters';
    const session = createAdminSession('test-admin');
    expect(verifyAdminSession(session.token)).toBe(true);
    expect(verifyAdminSession(`${session.token}tampered`)).toBe(false);
  });
});
