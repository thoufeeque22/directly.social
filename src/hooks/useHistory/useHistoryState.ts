import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostHistoryEntry, CockpitPost, PendingPostSchema } from './types';

// TODO: Refactor: logic extraction needed
export function useHistoryState() {
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState<PostHistoryEntry[]>([]);
  const [pendingPost, setPendingPost] = useState<CockpitPost | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('SS_PENDING_POST');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return PendingPostSchema.safeParse(parsed).success ? (parsed as CockpitPost) : null;
    } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeResumingId, setActiveResumingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => searchParams?.get('search') || '');
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  useEffect(() => {
    if (pendingPost && posts.length > 0) {
      const now = Date.now();
      const match = posts.find(p => 
        p.id === pendingPost.resumeHistoryId || 
        p.id === pendingPost.historyId ||
        (p.title === pendingPost.title && Math.abs(new Date(p.createdAt).getTime() - now) < 60000)
      );
      if (match) {
        React.startTransition(() => {
          setPendingPost(null);
        });
        localStorage.removeItem('SS_PENDING_POST');
      }
    }
  }, [posts, pendingPost]);

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
