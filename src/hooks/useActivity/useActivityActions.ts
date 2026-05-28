import { PostActivityEntry, CockpitPost } from './types';
import { useRetryHandler } from './useRetryHandler';
import { useCancelHandlers } from './useCancelHandlers';

interface UseActivityActionsProps {
  processingIds: string[]; setProcessingIds: (updater: (prev: string[]) => string[]) => void;
  cancelledIds: string[]; setCancelledIds: (updater: (prev: string[]) => string[]) => void;
  posts: PostActivityEntry[]; pendingPost: CockpitPost | null;
  setPendingPost: (post: CockpitPost | null) => void;
  fetchActivity: () => Promise<{ data?: PostActivityEntry[] }>;
  setPosts: (posts: PostActivityEntry[]) => void;
  setActiveResumingId: (id: string | null) => void;
}

export function useActivityActions(props: UseActivityActionsProps) {
  const { handleRetry } = useRetryHandler(
    props.processingIds, props.setProcessingIds, props.fetchActivity, props.setPosts
  );

  const { handleCancelPlatform, handleCancelAll } = useCancelHandlers(
    props.processingIds, props.setProcessingIds, props.cancelledIds, props.setCancelledIds,
    props.posts, props.pendingPost, props.setPendingPost, props.fetchActivity, props.setPosts,
    props.setActiveResumingId
  );

  return { handleRetry, handleCancelPlatform, handleCancelAll };
}
