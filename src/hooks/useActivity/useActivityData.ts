import { useEffect, useRef } from 'react';
import { PostActivityEntry } from './types';
import { useActivityFetcher } from './useActivityFetcher';
import { useActivityPolling } from './useActivityPolling';

interface UseActivityDataProps {
  searchQuery: string; setPosts: (posts: PostActivityEntry[]) => void;
  setNextCursor: (cursor: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  posts: PostActivityEntry[]; nextCursor: string | null; loadingMore: boolean;
}

export function useActivityData({
  searchQuery, setPosts, setNextCursor, setIsLoading, setLoadingMore, posts, nextCursor, loadingMore
}: UseActivityDataProps) {
  const { fetchActivity } = useActivityFetcher();
  const initialFetchRef = useRef(false);
  useActivityPolling(posts, searchQuery, setPosts, fetchActivity);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initialFetchRef.current && posts.length === 0) setIsLoading(true);
      fetchActivity(undefined, searchQuery).then(data => {
        setPosts(data.data || []); setNextCursor(data.nextCursor);
        setIsLoading(false); initialFetchRef.current = true;
      }).catch(() => setIsLoading(false));
    }, searchQuery ? 400 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchActivity, setPosts, setNextCursor, setIsLoading]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchActivity(undefined, searchQuery).then(data => {
        setPosts(data.data || []); setNextCursor(data.nextCursor);
      });
    };
    globalThis.addEventListener('app:refresh', handleRefresh);
    return () => globalThis.removeEventListener('app:refresh', handleRefresh);
  }, [fetchActivity, searchQuery, setPosts, setNextCursor]);

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    const data = await fetchActivity(nextCursor, searchQuery);
    setPosts([...posts, ...(data.data || [])]);
    setNextCursor(data.nextCursor);
    setLoadingMore(false);
  };

  return { fetchActivity, handleLoadMore };
}
