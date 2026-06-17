import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { updateScheduledPost } from '@/app/actions/activity/update-schedule';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { useAiByok } from '@/hooks/useAiByok';
import { useAIPreviewCache } from '@/hooks/useAIPreviewCache';
import { checkCacheValidity } from '@/components/dashboard/UploadForm/UploadFormContext.utils';
import { PostActivityEntry } from '@/app/schedule/types';

export function useScheduleAI(
  editingPost: PostActivityEntry | null,
  setEditingPost: React.Dispatch<React.SetStateAction<PostActivityEntry | null>>,
  fetchSchedule: () => void,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { update } = useSession();
  const { configs: byokConfigs } = useAiByok();
  const { aiPreviews, setAiPreviews, clearCache } = useAIPreviewCache();
  const [isAILoading, setIsAILoading] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const isCacheValid = useMemo(() => {
    if (!isMounted) return false;
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
    } catch { return false; }
  }, [aiPreviews, editingPost, isMounted]);

  const handleAIBrainstorm = async () => {
    if (!editingPost) return;
    setIsAILoading(true);
    try {
      const pNames = editingPost.platforms.map(p => p.platform);
      const form = document.querySelector('form');
      const formData = form ? new FormData(form) : null;
      const title = formData?.get('title') as string || editingPost.title;
      const desc = formData?.get('description') as string || editingPost.description || '';
      
      const { getMultiPlatformAIPreviews } = await import('@/app/actions/ai');
      const previews = await getMultiPlatformAIPreviews({
        title, description: desc, tier: 'Enrich', mode: 'Smart', platforms: pNames, visualData: [], customStyleText: undefined, byokConfigs
      });
      
      const { getAiBalance } = await import('@/app/actions/credits');
      await update({ aiCredits: await getAiBalance() });

      if (previews) {
        localStorage.setItem('SS_AI_PREVIEWS_CONTEXT', JSON.stringify({ title, description: desc, platforms: pNames, aiTier: 'Enrich', contentMode: 'Smart' }));
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
    if (!editingPost?.stagedFileId) { alert("Error: Missing file reference."); return; }
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

  return { isReviewing, setIsReviewing, isAILoading, isCacheValid, aiPreviews, handleAIBrainstorm, handleConfirmReview, clearCache };
}
