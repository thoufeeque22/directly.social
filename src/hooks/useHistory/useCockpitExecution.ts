import { useCallback } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { distributeToPlatforms } from '@/lib/upload/upload-utils';
import { PlatformResult, PostHistoryEntry, CockpitPost } from './types';
import { AIWriteResult } from '@/lib/utils/ai-writer';

export function useCockpitExecution(setPosts: (p: PostHistoryEntry[]) => void, fetchHistory: () => Promise<{ data?: PostHistoryEntry[] }>, setActiveResumingId: (id: string | null) => void) {
  const { accounts } = useAccounts();

  return useCallback(async (stagedFileId: string, fileName: string, historyId: string, post: CockpitPost, reviewedContent?: Record<string, AIWriteResult>) => {
    try {
      if (reviewedContent) {
        const { updatePlatformResultsAction } = await import('@/app/actions/history/metadata');
        await updatePlatformResultsAction(historyId, reviewedContent);
      }
      const selectedAccountIds = post.platforms.map((p: PlatformResult) => {
         const account = accounts.find(acc => acc.id === p.accountId);
         if (!account) return (p.accountId?.startsWith('local-dev-')) ? p.accountId : null;
         return (p.platform === 'facebook' || p.platform === 'instagram') ? `${p.platform}:${account.id}` : account.id;
      }).filter((id): id is string => id !== null);

      await distributeToPlatforms({
        stagedFileId, fileName, historyId,
        accounts: accounts.map(a => ({ id: a.id, provider: a.provider, accountName: a.accountName })),
        selectedAccountIds,
        fields: { title: post.title || '', description: post.description || '', contentMode: post.contentMode || 'Smart', videoFormat: post.videoFormat || 'short' },
        onPlatformStatus: () => {},
        onAccountSuccess: async () => { const updated = await fetchHistory(); setPosts(updated.data || []); }
      });
      const data = await fetchHistory(); setPosts(data.data || []);
      setTimeout(() => { setActiveResumingId(null); window.history.replaceState({}, '', '/history'); }, 2000);
    } catch (e) { console.error(e); }
  }, [accounts, fetchHistory, setPosts, setActiveResumingId]);
}
