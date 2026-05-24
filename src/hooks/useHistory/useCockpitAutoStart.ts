import { useCallback, useRef, useEffect } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { useAiByok } from '@/hooks/useAiByok';
import { stageVideoFile } from '@/lib/upload/upload-utils';
import { getDraftFile } from '@/lib/upload/file-store';
import { AITier } from '@/lib/core/constants';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { CockpitPost, PostHistoryEntry } from './types';

interface AutoStartProps {
  setPosts: (posts: PostHistoryEntry[]) => void;
  fetchHistory: () => Promise<{ data?: PostHistoryEntry[] }>;
  setActiveResumingId: (id: string | null) => void;
  executeCockpitDistribution: (stagedFileId: string, fileName: string, historyId: string, post: CockpitPost, reviewed?: Record<string, AIWriteResult>) => Promise<void>;
}

export function useCockpitAutoStart({ setPosts, fetchHistory, setActiveResumingId, executeCockpitDistribution }: AutoStartProps) {
  const cockpitStartedRef = useRef(false);
  const { accounts } = useAccounts();
  const { configs: byokConfigs } = useAiByok();

  const handleCockpitStart = useCallback(async () => {
    if (accounts.length === 0) return;
    const pending = localStorage.getItem('SS_PENDING_POST');
    if (!pending) return;
    const post = JSON.parse(pending) as CockpitPost;
    setActiveResumingId(post.resumeHistoryId || 'cockpit-active');
    fetchHistory().then(d => setPosts(d.data || [])).catch(console.error);
    
    try {
      let stagedFileId = post.galleryFileId, fileName = post.galleryFileName || '', historyId = post.resumeHistoryId || '';
      if (!stagedFileId) {
        const file = await getDraftFile();
        if (!file) throw new Error("Video file not found");
        const res = await stageVideoFile({ file, onStatusUpdate: () => {}, metadata: { title: post.title, description: post.description, videoFormat: post.videoFormat }, platforms: post.platforms.map(p => ({ platform: p.platform, accountId: p.accountId || '' })), resumeHistoryId: post.resumeHistoryId });
        stagedFileId = res.stagedFileId; fileName = res.fileName; historyId = res.historyId;
      }
      let reviewed: Record<string, AIWriteResult> | undefined;
      if (post.aiTier !== 'Manual' && post.skipReview) {
        const { getMultiPlatformAIPreviews } = await import('@/app/actions/ai');
        reviewed = await getMultiPlatformAIPreviews(post.title, post.description || '', post.aiTier as AITier, post.contentMode || 'Smart', post.platforms.map(p => p.platform), [], post.customStyleText, byokConfigs);
        const { updatePlatformResultsAction } = await import('@/app/actions/history/metadata');
        await updatePlatformResultsAction(historyId, reviewed);
      }
      if (stagedFileId && fileName) await executeCockpitDistribution(stagedFileId, fileName, historyId, post, reviewed);
    } catch (e) { console.error(e); setTimeout(() => setActiveResumingId(null), 5000); }
  }, [accounts, fetchHistory, executeCockpitDistribution, byokConfigs, setPosts, setActiveResumingId]);

  useEffect(() => {
    const action = new URL(globalThis.window?.location.href || '').searchParams.get('action');
    if (action === 'distribute' && !cockpitStartedRef.current && accounts.length > 0) {
      cockpitStartedRef.current = true; handleCockpitStart();
    }
  }, [accounts, handleCockpitStart]);

  return { handleCockpitStart };
}
