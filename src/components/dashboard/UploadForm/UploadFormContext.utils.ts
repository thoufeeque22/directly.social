import { Account } from '@/lib/core/types';

export const getSelectedPlatforms = (selectedAccountIds: string[], accounts: Account[]): string[] => {
  const platformsSet = new Set<string>();
  selectedAccountIds.forEach((id: string) => {
    const isSplit = id.includes(':');
    const platformKey = isSplit ? id.split(':')[0] : null;
    const actualAccountId = isSplit ? id.split(':')[1] : id;
    const account = accounts.find((a: Account) => a.id === actualAccountId);
    if (isSplit && platformKey) {
      platformsSet.add(platformKey);
    } else if (account) {
      platformsSet.add(account.provider === 'google' ? 'youtube' : account.provider);
    }
  });
  return Array.from(platformsSet);
};

export const checkCacheValidity = (
  current: { title: string; description: string; platforms: string[]; aiTier: string; contentMode: string },
  cached: { title: string; description: string; platforms: string[]; aiTier: string; contentMode: string }
): boolean => {
  if (current.aiTier !== cached.aiTier) return false;
  if (current.contentMode !== cached.contentMode) return false;
  
  if (current.platforms.length !== cached.platforms.length) return false;
  if (!current.platforms.every(p => cached.platforms.includes(p))) return false;

  // Significant Title change: > 20 chars or > 30% of original
  const titleDiff = Math.abs(current.title.length - cached.title.length);
  if (titleDiff > 20 || (cached.title.length > 0 && titleDiff / cached.title.length > 0.3)) return false;

  // Significant Description change: > 50 chars or > 30% of original
  const descDiff = Math.abs(current.description.length - cached.description.length);
  if (descDiff > 50 || (cached.description.length > 0 && descDiff / cached.description.length > 0.3)) return false;

  return true;
};
