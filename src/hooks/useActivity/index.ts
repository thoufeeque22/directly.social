import { useActivityState } from './useActivityState';
import { useActivityData } from './useActivityData';
import { useActivityActions } from './useActivityActions';
import { useActivityCockpit } from './useActivityCockpit';

export function useActivity() {
  const state = useActivityState();
  const { fetchActivity, handleLoadMore } = useActivityData({
    searchQuery: state.searchQuery,
    setPosts: state.setPosts,
    setNextCursor: state.setNextCursor,
    setIsLoading: state.setIsLoading,
    setLoadingMore: state.setLoadingMore,
    posts: state.posts,
    nextCursor: state.nextCursor,
    loadingMore: state.loadingMore,
  });

  const actions = useActivityActions({
    processingIds: state.processingIds,
    setProcessingIds: state.setProcessingIds,
    cancelledIds: state.cancelledIds,
    setCancelledIds: state.setCancelledIds,
    posts: state.posts,
    pendingPost: state.pendingPost,
    setPendingPost: state.setPendingPost,
    fetchActivity,
    setPosts: state.setPosts,
    setActiveResumingId: state.setActiveResumingId,
  });

  const cockpit = useActivityCockpit({
    setPosts: state.setPosts,
    fetchActivity,
    setActiveResumingId: state.setActiveResumingId,
  });

  return {
    ...state,
    ...actions,
    ...cockpit,
    handleLoadMore,
    fetchActivity,
  };
}

export * from './types';
