import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

const ALGORITHM = 'aes-256-gcm';

/**
 * (CA-001): Encryption module for LinkedIn tokens.
 * Uses AES-256-GCM — the same algorithm as byos-encrypt.ts.
 * Key is derived from LINKEDIN_ENCRYPTION_KEY env var (falls back to BYOS_ENCRYPTION_KEY).
 */
const getEncryptionKey = (): Buffer => {
  const secret =
    process.env.LINKEDIN_ENCRYPTION_KEY ??
    process.env.BYOS_ENCRYPTION_KEY;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('LINKEDIN_ENCRYPTION_KEY is required in production');
  }
  return createHash('sha256').update(secret ?? 'dev-fallback-key').digest();
};

/**
 * Encrypts a plaintext string and returns an iv:authTag:ciphertext hex string.
 */
export const encryptLinkedInToken = (plaintext: string): string => {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypts a stored iv:authTag:ciphertext hex string back to plaintext.
 */
export const decryptLinkedInToken = (stored: string): string => {
  try {
    const key = getEncryptionKey();
    const parts = stored.split(':');
    if (parts.length !== 3) throw new Error('Invalid encrypted format');
    const [ivHex, authTagHex, ciphertext] = parts;
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    throw new Error('Failed to decrypt LinkedIn token');
  }
};
