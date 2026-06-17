import { Account } from '@/lib/core/types';

export interface PlatformMetadata {
  platform: string;
  accountId: string;
  overrideTitle?: string;
  overrideDescription?: string;
  hashtags?: string;
  firstCommentText?: string;
  scheduledAt?: string;
}

export const mapPlatforms = (
  ids: string[], 
  accs: Account[], 
  fd: FormData
): PlatformMetadata[] =>
  ids
    .map((id): PlatformMetadata | null => {
      const isSplit = id.includes(':');
      const platformKey = isSplit ? id.split(':')[0] : null;
      const accId = isSplit ? id.split(':')[1] : id;
      const acc = accs.find((a) => a.id === accId);
      if (!acc) return null;

      const provider = isSplit && platformKey ? platformKey : acc.provider === 'google' ? 'youtube' : acc.provider;
      const isOverridden = fd.get(`overridden_${provider}`) === 'true';

      return {
        platform: provider,
        accountId: accId,
        overrideTitle: isOverridden ? (fd.get(`title_${provider}`) as string) : undefined,
        overrideDescription: isOverridden ? (fd.get(`description_${provider}`) as string) : undefined,
        hashtags: (fd.get(`hashtags_${provider}`) || fd.get('hashtags')) as string,
        firstCommentText: (fd.get(`first_comment_${provider}`) || fd.get('firstComment')) as string,
        scheduledAt: (fd.get(`scheduled_at_${provider}`) || fd.get('scheduledAt')) as string,
      };
    })
    .filter((pl): pl is PlatformMetadata => pl !== null);
