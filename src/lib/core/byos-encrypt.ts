import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

const ALGORITHM = 'aes-256-gcm';

const getEncryptionKey = (): Buffer => {
  const secret = process.env.BYOS_ENCRYPTION_KEY;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('BYOS_ENCRYPTION_KEY is required in production');
  }
  return createHash('sha256').update(secret || 'dev-fallback-key').digest();
};

export const encryptByos = (text: string): string => {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

export const decryptByos = (text: string): string => {
  try {
    const key = getEncryptionKey();
    const parts = text.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted format');
    }
    const [ivHex, authTagHex, encrypted] = parts;
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error: unknown) {
    throw new Error('Failed to decrypt BYOS credential');
  }
};
