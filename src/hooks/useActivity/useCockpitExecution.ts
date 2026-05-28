import { useCallback } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { distributeToPlatforms } from '@/lib/upload/upload-utils';
import { PlatformResult, PostActivityEntry, CockpitPost } from './types';
import { AIWriteResult } from '@/lib/utils/ai-writer';

export function useCockpitExecution(setPosts: (p: PostActivityEntry[]) => void, fetchActivity: () => Promise<{ data?: PostActivityEntry[] }>, setActiveResumingId: (id: string | null) => void) {
  const { accounts } = useAccounts();

  return useCallback(async (stagedFileId: string, fileName: string, activityId: string, post: CockpitPost, reviewedContent?: Record<string, AIWriteResult>) => {
    try {
      if (reviewedContent) {
        const { updatePlatformResultsAction } = await import('@/app/actions/activity/metadata');
        await updatePlatformResultsAction(activityId, reviewedContent);
      }
      const selectedAccountIds = post.platforms.map((p: PlatformResult) => {
         const account = accounts.find(acc => acc.id === p.accountId);
         if (!account) return (p.accountId?.includes('local-dev-')) ? p.accountId : null;
         return (p.platform === 'facebook' || p.platform === 'instagram') ? `${p.platform}:${account.id}` : account.id;
      }).filter((id): id is string => id !== null);

      await distributeToPlatforms({
        stagedFileId, fileName, activityId,
        accounts: accounts.map(a => ({ id: a.id, provider: a.provider, accountName: a.accountName })),
        selectedAccountIds,
        fields: { title: post.title || '', description: post.description || '', contentMode: post.contentMode || 'Smart', videoFormat: post.videoFormat || 'short' },
        onPlatformStatus: () => {},
        onAccountSuccess: async () => { const updated = await fetchActivity(); setPosts(updated.data || []); }
      });
      const data = await fetchActivity(); setPosts(data.data || []);
      setTimeout(() => { setActiveResumingId(null); window.activity.replaceState({}, '', '/activity'); }, 2000);
    } catch (e) { console.error(e); }
  }, [accounts, fetchActivity, setPosts, setActiveResumingId]);
}
