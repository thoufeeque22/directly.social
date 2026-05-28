import { useCallback } from 'react';

export function useActivityFetcher() {
  const fetchActivity = useCallback(async (cursor?: string, search?: string, timestamp?: number) => {
    const params = new URLSearchParams({ limit: '20' });
    if (cursor) params.set('cursor', cursor);
    if (search) params.set('search', search);
    params.set('_t', (timestamp || Date.now()).toString());

    const res = await fetch(`/api/activity?${params.toString()}`);
    return await res.json();
  }, []);

  return { fetchActivity };
}
