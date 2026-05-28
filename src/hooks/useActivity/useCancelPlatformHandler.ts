import { PostActivityEntry } from './types';

export function useCancelPlatformHandler(
  processingIds: string[], setProcessingIds: (updater: (prev: string[]) => string[]) => void,
  cancelledIds: string[], setCancelledIds: (updater: (prev: string[]) => string[]) => void,
  fetchActivity: () => Promise<{ data?: PostActivityEntry[] }>,
  setPosts: (posts: PostActivityEntry[]) => void
) {
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

  return { handleCancelPlatform };
}
