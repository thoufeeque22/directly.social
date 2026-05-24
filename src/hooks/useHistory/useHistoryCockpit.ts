import { useRef } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { stageVideoFile, distributeToPlatforms } from '@/lib/upload/upload-utils';
import { getDraftFile } from '@/lib/upload/file-store';
import { PostHistoryEntry, CockpitPost } from './types';
import { useCockpitExecution } from './useCockpitExecution';
import { useCockpitAutoStart } from './useCockpitAutoStart';

interface CockpitProps {
  setPosts: (posts: PostHistoryEntry[]) => void;
  fetchHistory: () => Promise<{ data?: PostHistoryEntry[] }>;
  setActiveResumingId: (id: string | null) => void;
}

// TODO: Refactor: logic extraction needed - file > 50 lines.
export function useHistoryCockpit({ setPosts, fetchHistory, setActiveResumingId }: CockpitProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accounts } = useAccounts();
  const executeCockpitDistribution = useCockpitExecution(setPosts, fetchHistory, setActiveResumingId);

  useCockpitAutoStart({ setPosts, fetchHistory, setActiveResumingId, executeCockpitDistribution });

  const executePipeline = async (post: PostHistoryEntry, file: File) => {
    try {
      const { stagedFileId, fileName, historyId } = await stageVideoFile({ 
        file, onStatusUpdate: () => {}, 
        metadata: { title: post.title, description: post.description || undefined, videoFormat: post.videoFormat }, 
        platforms: post.platforms.map(p => ({ 
          platform: p.platform, 
          accountId: p.accountId || accounts.find(acc => (acc.provider === 'google' ? 'youtube' : acc.provider) === p.platform)?.id || '' 
        })).filter((p): p is { platform: string; accountId: string } => p.accountId !== ''), 
        resumeHistoryId: post.id 
      });

      const selectedAccountIds = post.platforms.map(p => {
        const accId = p.accountId || accounts.find(acc => (acc.provider === 'google' ? 'youtube' : acc.provider) === p.platform)?.id;
        return accId ? ((p.platform === 'facebook' || p.platform === 'instagram') ? `${p.platform}:${accId}` : accId) : null;
      }).filter((id): id is string => id !== null);

      await distributeToPlatforms({ 
        stagedFileId, fileName, historyId, 
        accounts: accounts.map(a => ({ id: a.id, provider: a.provider, accountName: a.accountName })), 
        selectedAccountIds, 
        fields: { 
          title: post.title || '', 
          description: post.description || '', 
          contentMode: (post as unknown as CockpitPost).contentMode || 'Smart',
          videoFormat: post.videoFormat || 'short' 
        }, 
        onPlatformStatus: () => {}, 
        onAccountSuccess: async () => { const updated = await fetchHistory(); setPosts(updated.data || []); } 
      });

      const data = await fetchHistory(); setPosts(data.data || []);
      setTimeout(() => { setActiveResumingId(null); window.history.replaceState({}, '', '/history'); }, 2000);
    } catch { setTimeout(() => setActiveResumingId(null), 5000); }
  };

  const handleInPlaceResume = async (post: PostHistoryEntry) => {
    setActiveResumingId(post.id);
    try {
      const file = await getDraftFile();
      if (!file) {
        if (fileInputRef.current) {
          fileInputRef.current.onchange = (e: Event) => { 
            const target = e.target as HTMLInputElement;
            const selected = target.files?.[0]; 
            if (selected) executePipeline(post, selected); 
          };
          fileInputRef.current.click();
        }
        return;
      }
      await executePipeline(post, file);
    } catch (e: unknown) { 
      setTimeout(() => setActiveResumingId(null), 3000); 
    }
  };

  return { fileInputRef, handleInPlaceResume };
}
