/* eslint-disable max-lines */
import { PlatformResult, PostActivityEntry, CockpitPost } from './types';

interface UseActivityActionsProps {
  processingIds: string[];
  setProcessingIds: (updater: (prev: string[]) => string[]) => void;
  cancelledIds: string[];
  setCancelledIds: (updater: (prev: string[]) => string[]) => void;
  posts: PostActivityEntry[];
  pendingPost: CockpitPost | null;
  setPendingPost: (post: CockpitPost | null) => void;
  fetchActivity: () => Promise<{ data?: PostActivityEntry[] }>;
  setPosts: (posts: PostActivityEntry[]) => void;
  setActiveResumingId: (id: string | null) => void;
}

// TODO: Refactor: logic extraction needed - file > 50 lines.
export function useActivityActions({
  processingIds, setProcessingIds, cancelledIds, setCancelledIds, posts, pendingPost, setPendingPost, fetchActivity, setPosts, setActiveResumingId
}: UseActivityActionsProps) {
  
  const handleRetry = async (e: React.MouseEvent, p: PlatformResult) => {
    e.preventDefault(); e.stopPropagation();
    if (processingIds.includes(p.id)) return;
    setProcessingIds(prev => [...prev, p.id]);
    try {
      const { retryUploadAction } = await import('@/app/actions/activity/retry');
      const res = await retryUploadAction(p.id);
      if (res.success) {
        const data = await fetchActivity();
        setPosts(data.data || []);
      } else alert(`Retry failed: ${res.error}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Retry error: ${message}`);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== p.id));
    }
  };

  const handleCancelPlatform = async (e: React.MouseEvent, resultId: string, platform?: string, activityId?: string) => {
    e.preventDefault(); e.stopPropagation();
    if (processingIds.includes(resultId) || cancelledIds.includes(resultId)) return;
    setCancelledIds(prev => [...prev, resultId]);
    setProcessingIds(prev => [...prev, resultId]);
    try {
      if (resultId.startsWith('optimistic-') && platform && activityId && activityId !== 'optimistic-pending') {
        const { cancelPlatformByPostAction } = await import('@/app/actions/activity/cancel');
        await cancelPlatformByPostAction(activityId, platform);
      } else if (!resultId.startsWith('optimistic-')) {
        const { cancelPlatformUploadAction } = await import('@/app/actions/activity/cancel');
        await cancelPlatformUploadAction(resultId);
      }
      const data = await fetchActivity();
      setPosts(data.data || []);
    } catch {
      setCancelledIds(prev => prev.filter(id => id !== resultId));
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== resultId));
    }
  };

  const handleCancelAll = async (e: React.MouseEvent, activityId: string) => {
    e.preventDefault(); e.stopPropagation();
    const targetPost = posts.find(p => p.id === activityId);
    const isGhostMatch = pendingPost && (pendingPost.resumeActivityId === activityId || pendingPost.activityId === activityId || activityId === 'optimistic-pending');

    if (targetPost) setCancelledIds(prev => [...prev, ...targetPost.platforms.map(p => p.id)]);
    else if (isGhostMatch && pendingPost) setCancelledIds(prev => [...prev, ...pendingPost.platforms.map((_, i) => `optimistic-p-${i}`)]);
    
    if (globalThis.localStorage) {
      const staging = localStorage.getItem('SS_STAGING_STATUS');
      if (staging) {
        try {
          const { activityId: stagedId } = JSON.parse(staging);
          if (stagedId === activityId || activityId === 'optimistic-pending') {
            localStorage.setItem('SS_STAGING_STATUS', JSON.stringify({ activityId: stagedId, active: false, status: 'Stopped by user', timestamp: Date.now() }));
          }
        } catch {}
      }
    }
    setActiveResumingId(null);
    if (activityId === 'optimistic-pending') {
      setPendingPost(null); localStorage.removeItem('SS_PENDING_POST');
      return;
    }
    try {
      const { cancelAllUploadsAction } = await import('@/app/actions/activity/cancel');
      await cancelAllUploadsAction(activityId);
      const data = await fetchActivity();
      setPosts(data.data || []);
    } catch {}
  };

  return { handleRetry, handleCancelPlatform, handleCancelAll };
}
