import { useCallback, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAccounts } from '@/hooks/useAccounts';
import { useAiByok } from '@/hooks/useAiByok';
import { stageVideoFile } from '@/lib/upload/upload-utils';
import { getDraftFile } from '@/lib/upload/file-store';
import { AITier } from '@/lib/core/constants';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { CockpitPost, PostActivityEntry } from './types';

// TODO: Refactor: logic extraction needed
interface AutoStartProps {
  setPosts: (posts: PostActivityEntry[]) => void;
  fetchActivity: () => Promise<{ data?: PostActivityEntry[] }>;
  setActiveResumingId: (id: string | null) => void;
  executeCockpitDistribution: (stagedFileId: string, fileName: string, activityId: string, post: CockpitPost, reviewed?: Record<string, AIWriteResult>) => Promise<void>;
}

export function useCockpitAutoStart({ setPosts, fetchActivity, setActiveResumingId, executeCockpitDistribution }: AutoStartProps) {
  const cockpitStartedRef = useRef(false);
  const { accounts } = useAccounts();
  const { configs: byokConfigs } = useAiByok();
  const { update } = useSession();

  const handleCockpitStart = useCallback(async () => {
    if (accounts.length === 0) return;
    const pending = localStorage.getItem('SS_PENDING_POST');
    if (!pending) return;
    const post = JSON.parse(pending) as CockpitPost;
    setActiveResumingId(post.resumeActivityId || 'cockpit-active');
    fetchActivity().then(d => setPosts(d.data || [])).catch(console.error);
    
    try {
      let stagedFileId = post.galleryFileId, fileName = post.galleryFileName || '', activityId = post.resumeActivityId || '';
      if (!stagedFileId) {
        const file = await getDraftFile();
        if (!file) throw new Error("Video file not found");
        const res = await stageVideoFile({ 
          file, 
          onStatusUpdate: () => {}, 
          metadata: { title: post.title, description: post.description, videoFormat: post.videoFormat }, 
          platforms: post.platforms.map(p => ({ 
            platform: p.platform, 
            accountId: p.accountId || '',
            metadata: p.metadata
          })), 
          resumeActivityId: post.resumeActivityId 
        });
        stagedFileId = res.stagedFileId; fileName = res.fileName; activityId = res.activityId;
      }
      let reviewed: Record<string, AIWriteResult> | undefined;
      if (post.aiTier !== 'Manual' && post.skipReview) {
        const { getMultiPlatformAIPreviews } = await import('@/app/actions/ai');
        reviewed = await getMultiPlatformAIPreviews({
          title: post.title,
          description: post.description || '',
          tier: post.aiTier as AITier,
          mode: post.contentMode || 'Smart',
          platforms: post.platforms.map(p => p.platform),
          visualData: [],
          customStyleText: post.customStyleText,
          byokConfigs
        });
        const { getAiBalance } = await import('@/app/actions/credits');
        const newBalance = await getAiBalance();
        await update({ aiCredits: newBalance });
        
        const { updatePlatformResultsAction } = await import('@/app/actions/activity/metadata');
        await updatePlatformResultsAction(activityId, reviewed);
      }
      if (stagedFileId && fileName) await executeCockpitDistribution(stagedFileId, fileName, activityId, post, reviewed);
    } catch (e) { console.error(e); setTimeout(() => setActiveResumingId(null), 5000); }
  }, [accounts, fetchActivity, executeCockpitDistribution, byokConfigs, setPosts, setActiveResumingId, update]);

  useEffect(() => {
    const action = new URL(globalThis.window?.location.href || '').searchParams.get('action');
    if (action === 'distribute' && !cockpitStartedRef.current && accounts.length > 0) {
      cockpitStartedRef.current = true; handleCockpitStart();
    }
  }, [accounts, handleCockpitStart]);

  return { handleCockpitStart };
}
