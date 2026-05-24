import { useCallback, useEffect } from 'react';
import { usePolling } from '@/hooks/usePolling';
import { PostHistoryEntry } from './types';

interface UseHistoryDataProps {
  searchQuery: string;
  setPosts: (posts: PostHistoryEntry[]) => void;
  setNextCursor: (cursor: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  posts: PostHistoryEntry[];
  nextCursor: string | null;
  loadingMore: boolean;
}

export function useHistoryData({
  searchQuery, setPosts, setNextCursor, setIsLoading, setLoadingMore, posts, nextCursor, loadingMore
}: UseHistoryDataProps) {
  
  const fetchHistory = useCallback(async (cursor?: string, search?: string) => {
    const params = new URLSearchParams({ limit: '20' });
    if (cursor) params.set('cursor', cursor);
    if (search) params.set('search', search);
    params.set('_t', Date.now().toString());

    const res = await fetch(`/api/history?${params.toString()}`);
    return await res.json();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (posts.length === 0) setIsLoading(true);
      fetchHistory(undefined, searchQuery).then(data => {
        setPosts(data.data || []);
        setNextCursor(data.nextCursor);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    }, searchQuery ? 400 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchHistory, posts.length, setPosts, setNextCursor, setIsLoading]);

  const hasActivePosts = posts.some(post => 
    post.platforms.some(p => ['pending', 'uploading', 'processing', 'retrying'].includes(p.status))
  );

  usePolling({
    callback: async () => {
      const data = await fetchHistory(undefined, searchQuery);
      setPosts(data.data || []);
    },
    interval: hasActivePosts ? 5000 : 15000,
    isActive: posts.length > 0
  });

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    const data = await fetchHistory(nextCursor, searchQuery);
    setPosts([...posts, ...(data.data || [])]);
    setNextCursor(data.nextCursor);
    setLoadingMore(false);
  };

  return { fetchHistory, handleLoadMore };
}
