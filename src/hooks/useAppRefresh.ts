'use client';

import { useState, useCallback, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export const useAppRefresh = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    setIsManualRefreshing(true);

    try {
      // 1. Refresh server components
      startTransition(() => {
        router.refresh();
      });

      // 2. Dispatch global events for client components
      globalThis.dispatchEvent(new CustomEvent('refresh-upcoming'));
      globalThis.dispatchEvent(new CustomEvent('app:refresh'));

      // 3. Minimum delay for UX/Animation (800ms)
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setIsManualRefreshing(false);
      isRefreshingRef.current = false;
    }
  }, [router]);

  return {
    refresh,
    isRefreshing: isPending || isManualRefreshing
  };
};
