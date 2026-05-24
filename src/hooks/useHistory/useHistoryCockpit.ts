import { useCallback, useRef, useEffect } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { useAiByok } from '@/hooks/useAiByok';
import { stageVideoFile, distributeToPlatforms } from '@/lib/upload/upload-utils';
import { getDraftFile } from '@/lib/upload/file-store';
import { AITier } from '@/lib/core/constants';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { CockpitPost, PostHistoryEntry } from './types';
import { useCockpitExecution } from './useCockpitExecution';

interface CockpitProps {
  setPosts: (posts: PostHistoryEntry[]) => void;
  fetchHistory: () => Promise<any>;
  setActiveResumingId: (id: string | null) => void;
}

// TODO: Refactor: logic extraction needed - file > 50 lines.
export function useHistoryCockpit({ setPosts, fetchHistory, setActiveResumingId }: CockpitProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cockpitStartedRef = useRef(false);
  const { accounts } = useAccounts();
  const { configs: byokConfigs } = useAiByok();
  const executeCockpitDistribution = useCockpitExecution(setPosts, fetchHistory, setActiveResumingId);

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

  const executePipeline = async (post: PostHistoryEntry, file: File) => {
    try {
      const { stagedFileId, fileName, historyId } = await stageVideoFile({ file, onStatusUpdate: () => {}, metadata: { title: post.title, description: post.description || undefined, videoFormat: post.videoFormat }, platforms: post.platforms.map(p => ({ platform: p.platform, accountId: p.accountId || accounts.find(acc => (acc.provider === 'google' ? 'youtube' : acc.provider) === p.platform)?.id || '' })).filter(p => p.accountId !== '') as any, resumeHistoryId: post.id });
      const selectedAccountIds = post.platforms.map(p => {
        const accId = p.accountId || accounts.find(acc => (acc.provider === 'google' ? 'youtube' : acc.provider) === p.platform)?.id;
        return accId ? ((p.platform === 'facebook' || p.platform === 'instagram') ? `${p.platform}:${accId}` : accId) : null;
      }).filter((id): id is string => id !== null);
      await distributeToPlatforms({ stagedFileId, fileName, historyId, accounts: accounts.map(a => ({ id: a.id, provider: a.provider, accountName: a.accountName })), selectedAccountIds, fields: { title: post.title || '', description: post.description || '', contentMode: (post as any).contentMode || 'Smart', videoFormat: post.videoFormat || 'short' }, onPlatformStatus: () => {}, onAccountSuccess: async () => { const updated = await fetchHistory(); setPosts(updated.data || []); } });
      const data = await fetchHistory(); setPosts(data.data || []);
      setTimeout(() => setActiveResumingId(null), 2000);
    } catch { setTimeout(() => setActiveResumingId(null), 5000); }
  };

  const handleInPlaceResume = async (post: PostHistoryEntry) => {
    setActiveResumingId(post.id);
    try {
      const file = await getDraftFile();
      if (!file) {
        if (fileInputRef.current) {
          fileInputRef.current.onchange = (e: any) => { const selected = e.target.files?.[0]; if (selected) executePipeline(post, selected); };
          fileInputRef.current.click();
        }
        return;
      }
      await executePipeline(post, file);
    } catch { setTimeout(() => setActiveResumingId(null), 3000); }
  };

  return { fileInputRef, handleInPlaceResume };
}
