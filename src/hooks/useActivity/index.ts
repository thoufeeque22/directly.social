import { useMemo } from 'react';
import { useActivityState } from './useActivityState';
import { useActivityData } from './useActivityData';
import { useActivityActions } from './useActivityActions';
import { useActivityCockpit } from './useActivityCockpit';
import { PostActivityEntry } from './types';

export function useActivity() {
  const state = useActivityState();
  const { fetchActivity, handleLoadMore } = useActivityData({
    searchQuery: state.searchQuery, setPosts: state.setPosts, setNextCursor: state.setNextCursor,
    setIsLoading: state.setIsLoading, setLoadingMore: state.setLoadingMore,
    posts: state.posts, nextCursor: state.nextCursor, loadingMore: state.loadingMore,
  });

  const actions = useActivityActions({
    processingIds: state.processingIds, setProcessingIds: state.setProcessingIds,
    cancelledIds: state.cancelledIds, setCancelledIds: state.setCancelledIds,
    posts: state.posts, pendingPost: state.pendingPost, setPendingPost: state.setPendingPost,
    fetchActivity, setPosts: state.setPosts, setActiveResumingId: state.setActiveResumingId,
  });

  const cockpit = useActivityCockpit({ setPosts: state.setPosts, fetchActivity, setActiveResumingId: state.setActiveResumingId });

  const reconciledPosts = useMemo(() => {
    if (!state.pendingPost) return state.posts;
    const optimisticId = state.pendingPost.resumeActivityId || state.pendingPost.activityId || 'optimistic-pending';
    const optimisticPost: PostActivityEntry = {
      ...state.pendingPost,
      id: optimisticId,
      createdAt: new Date().toISOString(),
      description: state.pendingPost.description || null,
      stagedFileId: state.pendingPost.stagedFileId || null,
      isOptimistic: true,
      platforms: (state.pendingPost.platforms || []).map((p: { platform: string; accountId?: string | null; overrideTitle?: string | null; overrideDescription?: string | null; metadata?: { title?: string | null; description?: string | null } | null }, index: number) => ({
        id: `optimistic-${p.platform}-${p.accountId || index}`,
        platform: p.platform,
        accountName: null,
        platformPostId: null,
        permalink: null,
        status: 'pending',
        progress: 0,
        errorMessage: null,
        accountId: p.accountId || '',
        metadata: {
          title: p.overrideTitle,
          description: p.overrideDescription,
        },
      })),
    };
    return [optimisticPost, ...state.posts.filter(p => p.id !== optimisticId)];
  }, [state.pendingPost, state.posts]);

  return { ...state, ...actions, ...cockpit, reconciledPosts, handleLoadMore, fetchActivity };
}

export * from './types';
