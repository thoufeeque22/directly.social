import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePolling } from '@/hooks/usePolling';
import { PostActivityEntry } from '@/app/(dashboard)/schedule/types';
import { addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';

export function useScheduleData() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get('id');
  
  const [posts, setPosts] = useState<PostActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'month' | 'week'>('timeline');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // Fix INP issue: no setState in useEffect for currentDate mount, init with new Date()
  // Wait, if it causes hydration mismatch, we might need a standard approach:
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true); 
  }, []);

  const nextPeriod = () => {
    if (viewMode === 'month') setCurrentDate(prev => addMonths(prev, 1));
    else if (viewMode === 'week') setCurrentDate(prev => addWeeks(prev, 1));
  };

  const prevPeriod = () => {
    if (viewMode === 'month') setCurrentDate(prev => subMonths(prev, 1));
    else if (viewMode === 'week') setCurrentDate(prev => subWeeks(prev, 1));
  };

  const goToToday = () => setCurrentDate(new Date());

  const fetchSchedule = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        published: (viewMode === 'month' || viewMode === 'week') ? 'all' : 'false',
        _t: Date.now().toString()
      });
      if (targetId || viewMode === 'month' || viewMode === 'week') params.set('limit', '100');

      const res = await fetch(`/api/activity?${params.toString()}`);
      const data = await res.json();
      setPosts(data.data || []);
    } catch (err) {
      console.error('Failed to fetch schedule:', err);
    } finally {
      setIsLoading(false);
    }
  }, [targetId, viewMode]);

  // Deriving hasActivePosts synchronously instead of using useEffect + setState (Fix INP)
  const hasActivePosts = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    return posts.some(p => new Date(p.scheduledAt).getTime() <= now + 30000);
  }, [posts]);

  usePolling({
    callback: fetchSchedule,
    interval: hasActivePosts ? 5000 : 30000,
    isActive: posts.length > 0
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSchedule();
    const refreshListener = () => fetchSchedule();
    globalThis.addEventListener('refresh-upcoming', refreshListener);
    return () => globalThis.removeEventListener('refresh-upcoming', refreshListener);
  }, [fetchSchedule]);

  return {
    posts, setPosts, isLoading, isMounted, viewMode, setViewMode,
    currentDate, nextPeriod, prevPeriod, goToToday, fetchSchedule, targetId
  };
}
