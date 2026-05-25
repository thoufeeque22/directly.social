import { PlatformResult, PostHistoryEntry, CockpitPost } from './types';

interface UseHistoryActionsProps {
  processingIds: string[];
  setProcessingIds: (updater: (prev: string[]) => string[]) => void;
  cancelledIds: string[];
  setCancelledIds: (updater: (prev: string[]) => string[]) => void;
  posts: PostHistoryEntry[];
  pendingPost: CockpitPost | null;
  setPendingPost: (post: CockpitPost | null) => void;
  fetchHistory: () => Promise<{ data?: PostHistoryEntry[] }>;
  setPosts: (posts: PostHistoryEntry[]) => void;
  setActiveResumingId: (id: string | null) => void;
}

// TODO: Refactor: logic extraction needed - file > 50 lines.
export function useHistoryActions({
  processingIds, setProcessingIds, cancelledIds, setCancelledIds, posts, pendingPost, setPendingPost, fetchHistory, setPosts, setActiveResumingId
}: UseHistoryActionsProps) {
  
  const handleRetry = async (e: React.MouseEvent, p: PlatformResult) => {
    e.preventDefault(); e.stopPropagation();
    if (processingIds.includes(p.id)) return;
    setProcessingIds(prev => [...prev, p.id]);
    try {
      const { retryUploadAction } = await import('@/app/actions/history/retry');
      const res = await retryUploadAction(p.id);
      if (res.success) {
        const data = await fetchHistory();
        setPosts(data.data || []);
      } else alert(`Retry failed: ${res.error}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Retry error: ${message}`);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== p.id));
    }
  };

  const handleCancelPlatform = async (e: React.MouseEvent, resultId: string, platform?: string, historyId?: string) => {
    e.preventDefault(); e.stopPropagation();
    if (processingIds.includes(resultId) || cancelledIds.includes(resultId)) return;
    setCancelledIds(prev => [...prev, resultId]);
    setProcessingIds(prev => [...prev, resultId]);
    try {
      if (resultId.startsWith('optimistic-') && platform && historyId && historyId !== 'optimistic-pending') {
        const { cancelPlatformByPostAction } = await import('@/app/actions/history/cancel');
        await cancelPlatformByPostAction(historyId, platform);
      } else if (!resultId.startsWith('optimistic-')) {
        const { cancelPlatformUploadAction } = await import('@/app/actions/history/cancel');
        await cancelPlatformUploadAction(resultId);
      }
      const data = await fetchHistory();
      setPosts(data.data || []);
    } catch {
      setCancelledIds(prev => prev.filter(id => id !== resultId));
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== resultId));
    }
  };

  const handleCancelAll = async (e: React.MouseEvent, historyId: string) => {
    e.preventDefault(); e.stopPropagation();
    const targetPost = posts.find(p => p.id === historyId);
    const isGhostMatch = pendingPost && (pendingPost.resumeHistoryId === historyId || pendingPost.historyId === historyId || historyId === 'optimistic-pending');

    if (targetPost) setCancelledIds(prev => [...prev, ...targetPost.platforms.map(p => p.id)]);
    else if (isGhostMatch && pendingPost) setCancelledIds(prev => [...prev, ...pendingPost.platforms.map((_, i) => `optimistic-p-${i}`)]);
    
    if (globalThis.localStorage) {
      const staging = localStorage.getItem('SS_STAGING_STATUS');
      if (staging) {
        try {
          const { historyId: stagedId } = JSON.parse(staging);
          if (stagedId === historyId || historyId === 'optimistic-pending') {
            localStorage.setItem('SS_STAGING_STATUS', JSON.stringify({ historyId: stagedId, active: false, status: 'Stopped by user', timestamp: Date.now() }));
          }
        } catch {}
      }
    }
    setActiveResumingId(null);
    if (historyId === 'optimistic-pending') {
      setPendingPost(null); localStorage.removeItem('SS_PENDING_POST');
      return;
    }
    try {
      const { cancelAllUploadsAction } = await import('@/app/actions/history/cancel');
      await cancelAllUploadsAction(historyId);
      const data = await fetchHistory();
      setPosts(data.data || []);
    } catch {}
  };

  return { handleRetry, handleCancelPlatform, handleCancelAll };
}
