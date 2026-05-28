import { PostActivityEntry, CockpitPost } from './types';
import { useCancelPlatformHandler } from './useCancelPlatformHandler';
import { useCancelAllHandler } from './useCancelAllHandler';

export function useCancelHandlers(
  processingIds: string[], setProcessingIds: (updater: (prev: string[]) => string[]) => void,
  cancelledIds: string[], setCancelledIds: (updater: (prev: string[]) => string[]) => void,
  posts: PostActivityEntry[], pendingPost: CockpitPost | null,
  setPendingPost: (post: CockpitPost | null) => void,
  fetchActivity: () => Promise<{ data?: PostActivityEntry[] }>,
  setPosts: (posts: PostActivityEntry[]) => void,
  setActiveResumingId: (id: string | null) => void
) {
  const { handleCancelPlatform } = useCancelPlatformHandler(
    processingIds, setProcessingIds, cancelledIds, setCancelledIds, fetchActivity, setPosts
  );

  const { handleCancelAll } = useCancelAllHandler(
    posts, pendingPost, setPendingPost, fetchActivity, setPosts, setCancelledIds, setActiveResumingId
  );

  return { handleCancelPlatform, handleCancelAll };
}
