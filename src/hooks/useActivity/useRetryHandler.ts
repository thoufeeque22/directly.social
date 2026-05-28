import { PlatformResult, PostActivityEntry } from './types';

export function useRetryHandler(
  processingIds: string[],
  setProcessingIds: (updater: (prev: string[]) => string[]) => void,
  fetchActivity: () => Promise<{ data?: PostActivityEntry[] }>,
  setPosts: (posts: PostActivityEntry[]) => void
) {
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
      alert(`Retry error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== p.id));
    }
  };

  return { handleRetry };
}
