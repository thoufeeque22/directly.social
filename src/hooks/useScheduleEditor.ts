import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { updateScheduledPost } from '@/app/actions/activity/update-schedule';
import { deleteScheduledPost, publishNowAction } from '@/app/actions/activity/delete-schedule';
import { usePolling } from '@/hooks/usePolling';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { useAiByok } from '@/hooks/useAiByok';
import { useAIPreviewCache } from '@/hooks/useAIPreviewCache';
import { checkCacheValidity } from '@/components/dashboard/UploadForm/UploadFormContext.utils';
import { addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import { PostActivityEntry } from '@/app/schedule/types';

export function useScheduleEditor() {
  const { update } = useSession();
  const searchParams = useSearchParams();
  const { configs: byokConfigs } = useAiByok();
  const targetId = searchParams.get('id');
  
  const [posts, setPosts] = useState<PostActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<PostActivityEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const { aiPreviews, setAiPreviews, clearCache } = useAIPreviewCache();
  const [isAILoading, setIsAILoading] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'month' | 'week'>('timeline');
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [hasActivePosts, setHasActivePosts] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentDate(new Date());
  }, []);

  const isCacheValid = useMemo(() => {
    if (!aiPreviews || Object.keys(aiPreviews).length === 0 || !editingPost) return false;
    try {
      const savedContext = localStorage.getItem('SS_AI_PREVIEWS_CONTEXT');
      if (!savedContext) return false;
      const context = JSON.parse(savedContext);
      const pNames = editingPost.platforms.map(p => p.platform);
      return checkCacheValidity(
        { title: editingPost.title, description: editingPost.description || '', platforms: pNames, aiTier: 'Enrich', contentMode: 'Smart' },
        context
      );
    } catch (e) { return false; }
  }, [aiPreviews, editingPost]);

  const nextPeriod = () => {
    if (!currentDate) return;
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const prevPeriod = () => {
    if (!currentDate) return;
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const fetchSchedule = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        published: (viewMode === 'month' || viewMode === 'week') ? 'all' : 'false',
        _t: Date.now().toString()
      });
      
      if (targetId || viewMode === 'month' || viewMode === 'week') {
        params.set('limit', '100');
      }

      const res = await fetch(`/api/activity?${params.toString()}`);
      const data = await res.json();
      setPosts(data.data || []);
    } catch (err) {
      console.error('Failed to fetch schedule:', err);
    } finally {
      setIsLoading(false);
    }
  }, [targetId, viewMode]);

  useEffect(() => {
    const now = Date.now();
    const hasActive = posts.some(p => {
      const scheduledTime = new Date(p.scheduledAt).getTime();
      return scheduledTime <= now + 30000;
    });
    setHasActivePosts(hasActive);
  }, [posts]);

  usePolling({
    callback: fetchSchedule,
    interval: hasActivePosts ? 5000 : 30000,
    isActive: posts.length > 0
  });

  useEffect(() => {
    fetchSchedule();
    const refreshListener = () => fetchSchedule();
    globalThis.addEventListener('refresh-upcoming', refreshListener);
    return () => {
      globalThis.removeEventListener('refresh-upcoming', refreshListener);
    };
  }, [fetchSchedule]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this scheduled post? The video file will be deleted.')) return;
    try {
      await deleteScheduledPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      globalThis.dispatchEvent(new CustomEvent('refresh-upcoming'));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Failed to delete: ${message}`);
    }
  };

  const handlePublishNow = async (id: string) => {
    if (!confirm('Publish this post immediately?')) return;
    try {
      await publishNowAction(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      globalThis.dispatchEvent(new CustomEvent('refresh-upcoming'));
      alert('Post moved to publishing queue! Check Activity in a few moments.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Failed to publish: ${message}`);
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingPost) return;
    setIsSaving(true);
    try {
      await updateScheduledPost(editingPost.id, {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        scheduledAt: formData.get('scheduledAt') as string,
      });
      setEditingPost(null);
      fetchSchedule();
      globalThis.dispatchEvent(new CustomEvent('refresh-upcoming'));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Update failed: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIBrainstorm = async () => {
    if (!editingPost) return;
    setIsAILoading(true);
    try {
      const pNames = editingPost.platforms.map(p => p.platform);
      const form = document.querySelector('form');
      const formData = form ? new FormData(form) : null;
      const currentTitle = formData?.get('title') as string || editingPost.title;
      const currentDesc = formData?.get('description') as string || editingPost.description || '';
      const { getMultiPlatformAIPreviews } = await import('@/app/actions/ai');
      const previews = await getMultiPlatformAIPreviews({
        title: currentTitle,
        description: currentDesc,
        tier: 'Enrich',
        mode: 'Smart',
        platforms: pNames,
        visualData: [],
        customStyleText: undefined,
        byokConfigs
      });
      
      const { getAiBalance } = await import('@/app/actions/credits');
      const newBalance = await getAiBalance();
      await update({ aiCredits: newBalance });

      if (previews) {
        localStorage.setItem('SS_AI_PREVIEWS_CONTEXT', JSON.stringify({ 
          title: currentTitle, 
          description: currentDesc, 
          platforms: pNames, 
          aiTier: 'Enrich', 
          contentMode: 'Smart' 
        }));
        setAiPreviews(previews);
        setIsReviewing(true);
      }
    } catch (err) {
      alert('AI Brainstorm failed.');
      console.error(err);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleConfirmReview = async (finalContent: Record<string, AIWriteResult>) => {
    if (!editingPost?.stagedFileId) {
       alert("Error: Missing file reference. Cannot save platform-specific metadata.");
       return;
    }
    setIsSaving(true);
    try {
      const { saveStagedMetadata } = await import('@/app/actions/activity/metadata');
      await saveStagedMetadata(editingPost.stagedFileId, finalContent);
      const firstPlatform = Object.keys(finalContent)[0];
      const newGlobalTitle = finalContent[firstPlatform]?.title || editingPost.title;
      await updateScheduledPost(editingPost.id, { title: newGlobalTitle });
      setIsReviewing(false);
      setEditingPost(null);
      clearCache();
      fetchSchedule();
      globalThis.dispatchEvent(new CustomEvent('refresh-upcoming'));
    } catch (err) {
      alert('Failed to save AI metadata sidecar');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    posts,
    isLoading,
    isMounted,
    editingPost,
    setEditingPost,
    isSaving,
    isReviewing,
    setIsReviewing,
    isAILoading,
    viewMode,
    setViewMode,
    currentDate,
    isCacheValid,
    aiPreviews,
    targetId,
    
    nextPeriod,
    prevPeriod,
    goToToday,
    handleDelete,
    handlePublishNow,
    handleUpdate,
    handleAIBrainstorm,
    handleConfirmReview,
    clearCache
  };
}
