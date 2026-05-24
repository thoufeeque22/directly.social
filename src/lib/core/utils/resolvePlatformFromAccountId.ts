import { Account } from '@/lib/core/types';

/**
 * Resolves the platform name from a distribution channel ID and associated accounts.
 * Handles prefixed IDs for multi-platform providers (e.g., Facebook/Instagram).
 */
export const resolvePlatformFromAccountId = (
  id: string,
  accounts: Account[]
): string => {
  if (id.startsWith('facebook:')) return 'facebook';
  if (id.startsWith('instagram:')) return 'instagram';

  const account = accounts.find((a) => a.id === id);
  if (!account) return 'unknown';

  return account.provider === 'google' ? 'youtube' : account.provider;
};
