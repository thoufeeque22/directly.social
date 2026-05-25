import { useHistoryState } from './useHistoryState';
import { useHistoryData } from './useHistoryData';
import { useHistoryActions } from './useHistoryActions';
import { useHistoryCockpit } from './useHistoryCockpit';

export function useHistory() {
  const state = useHistoryState();
  const { fetchHistory, handleLoadMore } = useHistoryData({
    searchQuery: state.searchQuery,
    setPosts: state.setPosts,
    setNextCursor: state.setNextCursor,
    setIsLoading: state.setIsLoading,
    setLoadingMore: state.setLoadingMore,
    posts: state.posts,
    nextCursor: state.nextCursor,
    loadingMore: state.loadingMore,
  });

  const actions = useHistoryActions({
    processingIds: state.processingIds,
    setProcessingIds: state.setProcessingIds,
    cancelledIds: state.cancelledIds,
    setCancelledIds: state.setCancelledIds,
    posts: state.posts,
    pendingPost: state.pendingPost,
    setPendingPost: state.setPendingPost,
    fetchHistory,
    setPosts: state.setPosts,
    setActiveResumingId: state.setActiveResumingId,
  });

  const cockpit = useHistoryCockpit({
    setPosts: state.setPosts,
    fetchHistory,
    setActiveResumingId: state.setActiveResumingId,
  });

  return {
    ...state,
    ...actions,
    ...cockpit,
    handleLoadMore,
    fetchHistory,
  };
}

export * from './types';
