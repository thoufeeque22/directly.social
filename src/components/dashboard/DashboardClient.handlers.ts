import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Account, PlatformPreference, VideoFormat } from '@/lib/core/types';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { AITier, StyleMode } from '@/lib/core/constants';
import { AIProvider } from '@/lib/core/ai';
import { extractVideoFrames } from '@/lib/utils/video-analysis';
import { ReviewContext } from './DashboardClient.types';
import { mapPlatforms } from './handlers/platformMapper';
import { generateAIStrategy } from './handlers/aiHandler';
import { handleSubmission } from './handlers/submissionHandler';

export const useDashboardHandlers = (
  resumeId: string | null, stagedId: string | null, devAccounts: Account[], selectedAccountIds: string[],
  aiTier: AITier, contentMode: StyleMode, aiProvider: AIProvider, customStyleText: string,
  byokConfigs: Record<string, { apiKey: string; modelId: string }> | undefined, videoFormat: VideoFormat,
  draftFileName: string | null, galleryFileId: string | null, galleryFileName: string | null,
  isScheduled: boolean, scheduledAt: string, setUploadStatus: (s: string) => void, setIsReviewing: (b: boolean) => void,
  setAiPreviews: (p: Record<string, AIWriteResult>) => void, setReviewContext: (c: ReviewContext) => void,
  setIsUploading: (b: boolean) => void, clearCache: () => void, preferences: PlatformPreference[] | undefined,
  handleFileChange: (f: File | null) => void, setGalleryFileId: (id: string | null) => void,
  setGalleryFileName: (n: string | null) => void, updateSession: (data: Record<string, unknown>) => Promise<unknown>,
  router: AppRouterInstance
) => {
  const onSubmit = async (fd: FormData) => {
    try {
      const platforms = mapPlatforms(selectedAccountIds, devAccounts, fd);
      if (platforms.length === 0) return setUploadStatus(' No platforms selected.');
      await handleSubmission({
        fd, platforms, videoFormat, resumeId, aiTier, contentMode, aiProvider, customStyleText, byokConfigs,
        galleryFileId, galleryFileName, draftFileName, isScheduled, scheduledAt, setUploadStatus, setAiPreviews,
        setReviewContext, setIsReviewing, updateSession, clearCache, router
      });
    } catch (err: unknown) {
      setUploadStatus(` Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const onConfirm = async (updated: Record<string, AIWriteResult>, context: ReviewContext | null) => {
    if (!context) return;
    setIsReviewing(false);
    setIsUploading(true);
    setUploadStatus(' Applying AI magic...');
    try {
      const { updatePlatformResultsAction } = await import('@/app/actions/activity/metadata');
      await updatePlatformResultsAction(context.activityId, updated);
      clearCache();
      localStorage.setItem('SS_PENDING_POST', JSON.stringify({
        title: 'AI Optimized Post', description: '', videoFormat, aiTier, contentMode, customStyleText,
        platforms: mapPlatforms(selectedAccountIds, devAccounts, context.formData), isScheduled, scheduledAt,
        galleryFileId, galleryFileName, resumeActivityId: context.activityId,
      }));
      router.push('/activity?action=distribute');
    } catch (err: unknown) {
      setUploadStatus(` Error: ${err instanceof Error ? err.message : String(err)}`);
      setIsUploading(false);
    }
  };

  const handleVisualScan = async (file: File) => {
    setUploadStatus(' Scanning video...');
    try {
      const frames = await extractVideoFrames(file);
      const platforms = (preferences || []).filter((pr) => pr.isEnabled).map((pr) => pr.platformId);
      const previews = await generateAIStrategy({ 
        title: '', description: '', tier: 'Generate', mode: contentMode, 
        platforms, customStyleText, byokConfigs, aiProvider,
        visualData: frames 
      });
      const { getAiBalance } = await import('@/app/actions/credits');
      await updateSession({ aiCredits: await getAiBalance() });
      setAiPreviews(previews);
      setIsReviewing(true);
    } catch (err: unknown) {
      setUploadStatus(` Error scanning: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return {
    onSubmit, onConfirm, handleVisualScan,
    handleFileChange: (f: File | null) => { setGalleryFileId(null); setGalleryFileName(null); handleFileChange(f); setAiPreviews({}); },
    handleGallerySelect: (id: string, n: string) => { setGalleryFileId(id); setGalleryFileName(n); handleFileChange(null); setUploadStatus(` Selected: ${n}`); setAiPreviews({}); },
  };
};
