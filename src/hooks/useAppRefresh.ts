'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

export const useAppRefresh = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    setIsRefreshing(true);

    try {
      // 1. Refresh server components
      router.refresh();

      // 2. Dispatch global events for client components
      globalThis.dispatchEvent(new CustomEvent('refresh-upcoming'));
      globalThis.dispatchEvent(new CustomEvent('app:refresh'));

      // 3. Minimum delay for UX/Animation (800ms)
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setIsRefreshing(false);
      isRefreshingRef.current = false;
    }
  }, [router]);

  return {
    refresh,
    isRefreshing
  };
};
