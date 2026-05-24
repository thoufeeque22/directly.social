import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostHistoryEntry, CockpitPost, PendingPostSchema } from './types';

export function useHistoryState() {
  const [posts, setPosts] = useState<PostHistoryEntry[]>([]);
  const [pendingPost, setPendingPost] = useState<CockpitPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeResumingId, setActiveResumingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const raw = localStorage.getItem('SS_PENDING_POST');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (PendingPostSchema.safeParse(parsed).success) {
        setPendingPost(parsed as CockpitPost);
      } else {
        localStorage.removeItem('SS_PENDING_POST');
      }
    } catch {
      localStorage.removeItem('SS_PENDING_POST');
    }
  }, []);

  useEffect(() => {
    if (pendingPost && posts.length > 0) {
      const match = posts.find(p => 
        p.id === pendingPost.resumeHistoryId || 
        p.id === pendingPost.historyId ||
        (p.title === pendingPost.title && Math.abs(new Date(p.createdAt).getTime() - Date.now()) < 60000)
      );
      if (match) {
        setPendingPost(null);
        localStorage.removeItem('SS_PENDING_POST');
      }
    }
  }, [posts, pendingPost]);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearchQuery(urlSearch);
  }, [searchParams]);

  return {
    posts, setPosts,
    pendingPost, setPendingPost,
    isLoading, setIsLoading,
    nextCursor, setNextCursor,
    loadingMore, setLoadingMore,
    activeResumingId, setActiveResumingId,
    searchQuery, setSearchQuery,
    cancelledIds, setCancelledIds,
    processingIds, setProcessingIds,
  };
}
