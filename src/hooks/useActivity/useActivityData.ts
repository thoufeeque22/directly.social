/* eslint-disable max-lines */
import { useCallback, useEffect } from 'react';
import { usePolling } from '@/hooks/usePolling';
import { PostActivityEntry } from './types';

// TODO: Refactor: logic extraction needed
interface UseActivityDataProps {
  searchQuery: string;
  setPosts: (posts: PostActivityEntry[]) => void;
  setNextCursor: (cursor: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  posts: PostActivityEntry[];
  nextCursor: string | null;
  loadingMore: boolean;
}

export function useActivityData({
  searchQuery, setPosts, setNextCursor, setIsLoading, setLoadingMore, posts, nextCursor, loadingMore
}: UseActivityDataProps) {
  
  const fetchActivity = useCallback(async (cursor?: string, search?: string, timestamp?: number) => {
    const params = new URLSearchParams({ limit: '20' });
    if (cursor) params.set('cursor', cursor);
    if (search) params.set('search', search);
    params.set('_t', (timestamp || Date.now()).toString());

    const res = await fetch(`/api/activity?${params.toString()}`);
    return await res.json();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (posts.length === 0) setIsLoading(true);
      fetchActivity(undefined, searchQuery).then(data => {
        setPosts(data.data || []);
        setNextCursor(data.nextCursor);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    }, searchQuery ? 400 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchActivity, posts.length, setPosts, setNextCursor, setIsLoading]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchActivity(undefined, searchQuery).then(data => {
        setPosts(data.data || []);
        setNextCursor(data.nextCursor);
      });
    };
    globalThis.addEventListener('app:refresh', handleRefresh);
    return () => globalThis.removeEventListener('app:refresh', handleRefresh);
  }, [fetchActivity, searchQuery, setPosts, setNextCursor]);

  const hasActivePosts = posts.some(post => 
    post.platforms.some(p => ['pending', 'uploading', 'processing', 'retrying'].includes(p.status))
  );

  usePolling({
    callback: async () => {
      const data = await fetchActivity(undefined, searchQuery);
      setPosts(data.data || []);
    },
    interval: hasActivePosts ? 5000 : 15000,
    isActive: posts.length > 0
  });

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
