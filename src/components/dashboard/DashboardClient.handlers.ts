/* eslint-disable max-lines */
import { ReviewContext } from './DashboardClient.types';
import { Account, PlatformPreference, VideoFormat } from '@/lib/core/types';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { AITier, StyleMode } from '@/lib/core/constants';
import { AIProvider } from '@/lib/core/ai';
import { extractVideoFrames } from '@/lib/utils/video-analysis';

export const useDashboardHandlers = (
  resumeId: string | null,
  stagedId: string | null,
  devAccounts: Account[],
  selectedAccountIds: string[],
  aiTier: AITier,
  contentMode: StyleMode,
  aiProvider: AIProvider,
  customStyleText: string,
  byokConfigs: Record<string, { apiKey: string; modelId: string }> | undefined,
  videoFormat: VideoFormat,
  draftFileName: string | null,
  galleryFileId: string | null,
  galleryFileName: string | null,
  isScheduled: boolean,
  scheduledAt: string,
  setUploadStatus: (s: string) => void,
  setIsReviewing: (b: boolean) => void,
  setAiPreviews: (p: Record<string, AIWriteResult>) => void,
  setReviewContext: (c: ReviewContext) => void,
  setIsUploading: (b: boolean) => void,
  clearCache: () => void,
  preferences: PlatformPreference[] | undefined,
  handleFileChange: (f: File | null) => void,
  setGalleryFileId: (id: string | null) => void,
  setGalleryFileName: (n: string | null) => void,
  updateSession: (data: Record<string, unknown>) => Promise<unknown>
) => {
  const mapPlatforms = (ids: string[], accs: Account[], specific: boolean, fd: FormData) =>
    ids
      .map((id) => {
        const isSplit = id.includes(':');
        const platformKey = isSplit ? id.split(':')[0] : null;
        const accId = isSplit ? id.split(':')[1] : id;
        const acc = accs.find((a) => a.id === accId);
        if (!acc) return null;

        const provider = isSplit && platformKey ? platformKey : acc.provider === 'google' ? 'youtube' : acc.provider;

        const customContent = specific
          ? {
              title: (fd.get(`title_${provider}`) || fd.get('title')) as string,
              description: (fd.get(`description_${provider}`) || fd.get('description')) as string,
            }
          : undefined;

        return { platform: provider, accountId: accId, customContent };
      })
      .filter((pl): pl is NonNullable<typeof pl> => !!pl);

  const onSubmit = async (fd: FormData) => {
    try {
      const specific = fd.get('isPlatformSpecific') === 'true';
      const platforms = mapPlatforms(selectedAccountIds, devAccounts, specific, fd);
      if (platforms.length === 0) {
        setUploadStatus(' No platforms selected.');
        return;
      }

      setUploadStatus(' Initializing Cockpit...');
      const initRes = await fetch('/api/upload/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fd.get('title'),
          description: fd.get('description'),
          videoFormat,
          platforms,
        }),
      });

      const initData = await initRes.json();
      const activityId = initData.data?.activityId || resumeId;

      if (aiTier !== 'Manual' && fd.get('skipReview') !== 'true') {
        setUploadStatus(' Generating AI Strategy...');
        const { getMultiPlatformAIPreviews } = await import('@/app/actions/ai');
        const title = fd.get('title') as string;
        const description = fd.get('description') as string;
        const platformsNames = platforms.map((p) => p.platform);

        const previews = await getMultiPlatformAIPreviews(
          title,
          description,
          aiTier,
          contentMode,
          platformsNames,
          [],
          customStyleText,
          byokConfigs,
          aiProvider
        );

        const { getAiBalance } = await import('@/app/actions/credits');
        const newBalance = await getAiBalance();
        await updateSession({ aiCredits: newBalance });

        if (previews) {
          localStorage.setItem(
            'SS_AI_PREVIEWS_CONTEXT',
            JSON.stringify({ title, description, platforms: platformsNames, aiTier, contentMode })
          );
        }

        setAiPreviews(previews);
        setReviewContext({
          activityId,
          stagedFileId: galleryFileId || '',
          fileName: galleryFileName || draftFileName || '',
          formData: fd,
        });
        setIsReviewing(true);
        return;
      }

      clearCache();
      localStorage.setItem(
        'SS_PENDING_POST',
        JSON.stringify({
          title: fd.get('title'),
          description: fd.get('description'),
          videoFormat,
          aiTier,
          contentMode,
          customStyleText,
          platforms,
          isScheduled,
          scheduledAt,
          galleryFileId,
          galleryFileName,
          resumeActivityId: activityId,
        })
      );
      window.location.href = '/activity?action=distribute';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadStatus(` Error: ${msg}`);
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
      localStorage.setItem(
        'SS_PENDING_POST',
        JSON.stringify({
          title: 'AI Optimized Post',
          description: '',
          videoFormat,
          aiTier,
          contentMode,
          customStyleText,
          platforms: mapPlatforms(selectedAccountIds, devAccounts, false, context.formData),
          isScheduled,
          scheduledAt,
          galleryFileId,
          galleryFileName,
          resumeActivityId: context.activityId,
        })
      );
      window.location.href = '/activity?action=distribute';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadStatus(` Error: ${msg}`);
      setIsUploading(false);
    }
  };

  const handleVisualScan = async (file: File) => {
    setUploadStatus(' Scanning video...');
    try {
      const frames = await extractVideoFrames(file);
      const pl = (preferences || []).filter((pr) => pr.isEnabled);
      const { getMultiPlatformAIPreviews } = await import('@/app/actions/ai');
      const previews = await getMultiPlatformAIPreviews(
        '',
        '',
        'Generate',
        contentMode,
        pl.map((pr) => pr.platformId),
        frames,
        customStyleText,
        byokConfigs,
        aiProvider
      );

      const { getAiBalance } = await import('@/app/actions/credits');
      const newBalance = await getAiBalance();
      await updateSession({ aiCredits: newBalance });
      setAiPreviews(previews);
      setIsReviewing(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadStatus(` Error scanning: ${msg}`);
    }
  };

  const handleFileChangeLocal = (f: File | null) => {
    setGalleryFileId(null);
    setGalleryFileName(null);
    handleFileChange(f);
    setAiPreviews({});
  };

  const handleGallerySelect = (id: string, n: string) => {
    setGalleryFileId(id);
    setGalleryFileName(n);
    handleFileChange(null);
    setUploadStatus(` Selected: ${n}`);
    setAiPreviews({});
  };

  return {
    onSubmit,
    onConfirm,
    handleVisualScan,
    handleFileChange: handleFileChangeLocal,
    handleGallerySelect,
  };
};
