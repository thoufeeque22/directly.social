/* eslint-disable max-lines */
import { ReviewContext } from './DashboardClient.types';
import { Account } from '@/lib/core/types';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { AITier, StyleMode } from '@/lib/core/constants';
import { AIProvider } from '@/lib/core/ai';

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
  videoFormat: string,
  draftFileName: string | null,
  galleryFileId: string | null,
  galleryFileName: string | null,
  isScheduled: boolean,
  scheduledAt: string,
  setUploadStatus: (s: string) => void,
  setIsReviewing: (b: boolean) => void,
  setAiPreviews: (p: Record<string, AIWriteResult>) => void,
  setReviewContext: (c: ReviewContext) => void,
  setIsUploading: (b: boolean) => void
) => {
  const map = (ids: string[], accs: Account[], specific: boolean, fd: FormData) => ids.map(id => {
    const isSplit = id.includes(':'), platformKey = isSplit ? id.split(':')[0] : null, accId = isSplit ? id.split(':')[1] : id, acc = accs.find(a => a.id === accId);
    if (!acc) return null;
    const provider = (isSplit && platformKey) ? platformKey : (acc.provider === 'google' ? 'youtube' : acc.provider);
    const customContent = specific ? { title: (fd.get(`title_${provider}`) || fd.get('title')) as string, description: (fd.get(`description_${provider}`) || fd.get('description')) as string } : undefined;
    return { platform: provider, accountId: accId, customContent };
  }).filter((pl): pl is NonNullable<typeof pl> => !!pl);

  const onSubmit = async (fd: FormData) => {
    try {
      const specific = fd.get('isPlatformSpecific') === 'true', platforms = map(selectedAccountIds, devAccounts, specific, fd);
      if (platforms.length === 0) { setUploadStatus(" No platforms selected."); return; }
      setUploadStatus(" Initializing Cockpit...");
      const initRes = await fetch('/api/upload/init', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: fd.get('title'), description: fd.get('description'), videoFormat, platforms }) });
      const initData = await initRes.json(), activityId = initData.data?.activityId || resumeId;
      if (aiTier !== 'Manual' && fd.get('skipReview') !== 'true') {
        setUploadStatus(" Generating AI Strategy...");
        const { getMultiPlatformAIPreviews } = await import('@/app/actions/ai');
        const previews = await getMultiPlatformAIPreviews(fd.get('title') as string, fd.get('description') as string, aiTier, contentMode, platforms.map(p => p.platform), [], customStyleText, byokConfigs, aiProvider);
        setAiPreviews(previews); setReviewContext({ activityId, stagedFileId: galleryFileId || '', fileName: galleryFileName || draftFileName || '', formData: fd }); setIsReviewing(true); return;
      }
      localStorage.setItem('SS_PENDING_POST', JSON.stringify({ title: fd.get('title'), description: fd.get('description'), videoFormat, aiTier, contentMode, customStyleText, platforms, isScheduled, scheduledAt, galleryFileId, galleryFileName, resumeActivityId: activityId }));
      window.location.href = '/activity?action=distribute';
    } catch (err: unknown) { const msg = err instanceof Error ? err.message : String(err); setUploadStatus(` Error: ${msg}`); }
  };

  const onConfirm = async (updated: Record<string, AIWriteResult>, context: ReviewContext | null) => {
    if (!context) return;
    setIsReviewing(false); setIsUploading(true); setUploadStatus(" Applying AI magic...");
    try {
      const { updatePlatformResultsAction } = await import('@/app/actions/activity/metadata');
      await updatePlatformResultsAction(context.activityId, updated);
      localStorage.setItem('SS_PENDING_POST', JSON.stringify({ title: "AI Optimized Post", description: "", videoFormat, aiTier, contentMode, customStyleText, platforms: map(selectedAccountIds, devAccounts, false, context.formData), isScheduled, scheduledAt, galleryFileId, galleryFileName, resumeActivityId: context.activityId }));
      window.location.href = '/activity?action=distribute';
    } catch (err: unknown) { const msg = err instanceof Error ? err.message : String(err); setUploadStatus(` Error: ${msg}`); setIsUploading(false); }
  };

  return { onSubmit, onConfirm };
};
