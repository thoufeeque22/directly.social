import { formatHandle } from "@/lib/utils/utils";
import type { Account, PlatformPreference } from "@/lib/core/types";

export interface DistributionChannel {
  id: string;
  platform: string;
  displayName: string;
}

/**
 * Expands connected accounts into individual distribution channels
 * (e.g., splitting a Facebook account into Facebook and Instagram channels).
 */
export const getDistributionChannels = (accounts: Account[], preferences?: PlatformPreference[]): DistributionChannel[] => {
    const isPlatformEnabled = (platformId: string) => {
        const pref = (preferences || []).find((p) => p.platformId === platformId);
        return pref ? pref.isEnabled : true;
    };
    return accounts.flatMap((account) => {
        const items: DistributionChannel[] = [];
        if (account.provider === 'facebook') {
            items.push({
                id: `facebook:${account.id}`,
                platform: 'facebook',
                displayName: formatHandle(account.accountName, 'facebook'),
            });
            items.push({
                id: `instagram:${account.id}`,
                platform: 'instagram',
                displayName: formatHandle(account.accountName, 'instagram'),
            });
        }
        else {
            const platform = account.provider === 'google' ? 'youtube' : account.provider;
            items.push({
                id: account.id,
                platform: platform,
                displayName: formatHandle(account.accountName, platform),
            });
        }
        return items.filter((item) => isPlatformEnabled(item.platform));
    });
};
