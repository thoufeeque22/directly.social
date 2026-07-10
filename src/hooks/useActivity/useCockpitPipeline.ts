import { useAccounts } from '@/hooks/useAccounts';
import { stageVideoFile, distributeToPlatforms } from '@/lib/upload/upload-utils';
import { PostActivityEntry, CockpitPost } from './types';

export function useCockpitPipeline(
  setPosts: (posts: PostActivityEntry[]) => void,
  fetchActivity: () => Promise<{ data?: PostActivityEntry[] }>,
  setActiveResumingId: (id: string | null) => void
) {
  const { accounts } = useAccounts();

  const executePipeline = async (post: PostActivityEntry, file: File) => {
    try {
      const { stagedFileId, fileName, activityId } = await stageVideoFile({ 
        file, onStatusUpdate: () => {}, 
        metadata: { title: post.title, description: post.description || undefined, videoFormat: post.videoFormat }, 
        platforms: post.platforms.map(p => ({ 
          platform: p.platform, 
          accountId: p.accountId || accounts.find(acc => (acc.provider === 'google' ? 'youtube' : acc.provider) === p.platform)?.id || '' 
        })).filter((p): p is { platform: string; accountId: string } => p.accountId !== ''), 
        resumeActivityId: post.id 
      });

      const selectedAccountIds = post.platforms.map(p => {
        const accId = p.accountId || accounts.find(acc => (acc.provider === 'google' ? 'youtube' : acc.provider) === p.platform)?.id;
        return accId ? `${p.platform}:${accId}` : null;
      }).filter((id): id is string => id !== null);

      await distributeToPlatforms({ 
        stagedFileId, fileName, activityId, 
        accounts: accounts.map(a => ({ id: a.id, provider: a.provider, accountName: a.accountName })), 
        selectedAccountIds, 
        fields: { 
          title: post.title || '', 
          description: post.description || '', 
          contentMode: (post as unknown as CockpitPost).contentMode || 'Smart',
          videoFormat: post.videoFormat || 'short' 
        }, 
        onPlatformStatus: () => {}, 
        onAccountSuccess: async () => { const updated = await fetchActivity(); setPosts(updated.data || []); } 
      });

      const data = await fetchActivity(); setPosts(data.data || []);
      setTimeout(() => { setActiveResumingId(null); window.history.replaceState({}, '', '/activity'); }, 2000);
    } catch { setTimeout(() => setActiveResumingId(null), 5000); }
  };

  return executePipeline;
}
