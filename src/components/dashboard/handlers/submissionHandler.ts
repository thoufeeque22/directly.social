import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { AITier, StyleMode } from '@/lib/core/constants';
import { AIProvider } from '@/lib/core/ai';
import { VideoFormat } from '@/lib/core/types';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { PlatformMetadata } from './platformMapper';
import { generateAIStrategy } from './aiHandler';
import { ReviewContext } from '../DashboardClient.types';

interface SubmissionOptions {
  fd: FormData;
  platforms: PlatformMetadata[];
  videoFormat: VideoFormat;
  resumeId: string | null;
  aiTier: AITier;
  contentMode: StyleMode;
  aiProvider: AIProvider;
  customStyleText: string;
  byokConfigs: Record<string, { apiKey: string; modelId: string }> | undefined;
  galleryFileId: string | null;
  galleryFileName: string | null;
  draftFileName: string | null;
  isScheduled: boolean;
  scheduledAt: string;
  setUploadStatus: (s: string) => void;
  setAiPreviews: (p: Record<string, AIWriteResult>) => void;
  setReviewContext: (c: ReviewContext) => void;
  setIsReviewing: (b: boolean) => void;
  updateSession: (data: Record<string, unknown>) => Promise<unknown>;
  clearCache: () => void;
  router: AppRouterInstance;
}

export const handleSubmission = async (options: SubmissionOptions) => {
  const { 
    fd, platforms, videoFormat, resumeId, aiTier, contentMode, aiProvider,
    customStyleText, byokConfigs, galleryFileId, galleryFileName, draftFileName,
    isScheduled, scheduledAt, setUploadStatus, setAiPreviews, setReviewContext,
    setIsReviewing, updateSession, clearCache, router
  } = options;

  setUploadStatus(' Initializing Cockpit...');
  const initRes = await fetch('/api/upload/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: fd.get('title') || platforms[0].overrideTitle || null,
      description: fd.get('description') || platforms[0].overrideDescription || null,
      videoFormat,
      platforms,
    }),
  });

  const initData = await initRes.json();
  const activityId = initData.data?.activityId || resumeId;

  if (aiTier !== 'Manual' && fd.get('skipReview') !== 'true') {
    setUploadStatus(' Generating AI Strategy...');
    const title = fd.get('title') as string;
    const description = fd.get('description') as string;
    const platformsNames = platforms.map((p) => p.platform);

    const previews = await generateAIStrategy({
      title, description, tier: aiTier, mode: contentMode,
      platforms: platformsNames, customStyleText, byokConfigs, aiProvider,
    });

    const { getAiBalance } = await import('@/app/actions/credits');
    const newBalance = await getAiBalance();
    await updateSession({ aiCredits: newBalance });

    if (previews) {
      localStorage.setItem('SS_AI_PREVIEWS_CONTEXT', JSON.stringify({ title, description, platforms: platformsNames, aiTier, contentMode }));
    }

    setAiPreviews(previews);
    setReviewContext({ activityId, stagedFileId: galleryFileId || '', fileName: galleryFileName || draftFileName || '', formData: fd });
    setIsReviewing(true);
    return;
  }

  clearCache();
  localStorage.setItem('SS_PENDING_POST', JSON.stringify({
    title: fd.get('title'), description: fd.get('description'), videoFormat, aiTier, contentMode,
    customStyleText, platforms, isScheduled, scheduledAt, galleryFileId, galleryFileName, resumeActivityId: activityId,
  }));
  router.push('/activity?action=distribute');
};
