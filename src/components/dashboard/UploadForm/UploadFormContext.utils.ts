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
