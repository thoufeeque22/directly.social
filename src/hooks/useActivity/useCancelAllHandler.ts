import { PostActivityEntry, CockpitPost } from './types';
import { useActivityStorage } from './useActivityStorage';

export function useCancelAllHandler(
  posts: PostActivityEntry[], pendingPost: CockpitPost | null,
  setPendingPost: (post: CockpitPost | null) => void,
  fetchActivity: () => Promise<{ data?: PostActivityEntry[] }>,
  setPosts: (posts: PostActivityEntry[]) => void,
  setCancelledIds: (updater: (prev: string[]) => string[]) => void,
  setActiveResumingId: (id: string | null) => void
) {
  const { updateStagingStatus, clearPendingPost } = useActivityStorage();

  const handleCancelAll = async (e: React.MouseEvent, activityId: string) => {
    e.preventDefault(); e.stopPropagation();
    const targetPost = posts.find(p => p.id === activityId);
    const isGhostMatch = pendingPost && (pendingPost.resumeActivityId === activityId || pendingPost.activityId === activityId || activityId === 'optimistic-pending');

    if (targetPost) setCancelledIds(prev => [...prev, ...targetPost.platforms.map(p => p.id)]);
    else if (isGhostMatch && pendingPost) setCancelledIds(prev => [...prev, ...pendingPost.platforms.map((_, i) => `optimistic-p-${i}`)]);
    
    updateStagingStatus(activityId);
    setActiveResumingId(null);
    if (activityId === 'optimistic-pending') {
      setPendingPost(null); clearPendingPost();
      return;
    }
    try {
      const { cancelAllUploadsAction } = await import('@/app/actions/activity/cancel');
      await cancelAllUploadsAction(activityId);
      const data = await fetchActivity();
      setPosts(data.data || []);
    } catch {}
  };

  return { handleCancelAll };
}
