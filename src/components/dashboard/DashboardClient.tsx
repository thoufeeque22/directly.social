'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccounts } from '@/hooks/useAccounts';
import { useDraftFile } from '@/hooks/dashboard/useDraftFile';
import { usePlatformSelection } from '@/hooks/dashboard/usePlatformSelection';
import { useAiByok } from '@/hooks/useAiByok';
import { extractVideoFrames } from '@/lib/utils/video-analysis';
import { DashboardView } from './DashboardClient.View';
import { ReviewContext, Asset, DashboardClientProps } from './DashboardClient.types';
import { useDashboardDevAccounts, useDashboardAIState, useDashboardUploadEngine, useDashboardAIPreviews } from './DashboardClient.hooks';
import { useDashboardHandlers } from './DashboardClient.handlers';

export default function DashboardClient(p: Readonly<DashboardClientProps>) {
  const searchParams = useSearchParams(), resumeId = searchParams.get('resume'), stagedId = searchParams.get('staged');
  const { accounts, isLoading, preferences } = useAccounts(p.initialAccounts, p.initialPreferences), { configs: byokConfigs } = useAiByok();
  const devAccounts = useDashboardDevAccounts(accounts, p.session?.user?.id);
  const { draftFileName, videoFormat, setVideoFormat, handleFileChange } = useDraftFile(p.session?.user?.id);
  const { selectedAccountIds, setSelectedAccountIds, handleToggleAccount } = usePlatformSelection(devAccounts, preferences, isLoading);
  const { isUploading, setIsUploading, setUploadStatus } = useDashboardUploadEngine(devAccounts);
  const { aiTier, setAiTier, aiProvider, setAiProvider, contentMode, setContentMode } = useDashboardAIState(p.initialAITier, p.initialAIStyle, p.initialAIProvider || 'gemini');
  const { aiPreviews, setAiPreviews, clearCache } = useDashboardAIPreviews();
  const [isReviewing, setIsReviewing] = useState(false), [isScheduled, setIsScheduled] = useState(false), [scheduledAt, setScheduledAt] = useState(''), [reviewContext, setReviewContext] = useState<ReviewContext | null>(null), [galleryFileId, setGalleryFileId] = useState<string | null>(null), [galleryFileName, setGalleryFileName] = useState<string | null>(null), [customStyleText, setCustomStyleText] = useState('');

  const { onSubmit, onConfirm } = useDashboardHandlers(resumeId, stagedId, devAccounts, selectedAccountIds, aiTier, contentMode, aiProvider, customStyleText, byokConfigs, videoFormat, draftFileName, galleryFileId, galleryFileName, isScheduled, scheduledAt, setUploadStatus, setIsReviewing, setAiPreviews, setReviewContext, setIsUploading, clearCache);

  useEffect(() => {
    if (resumeId && accounts.length > 0) {
      fetch(`/api/activity/${resumeId}`).then(r => r.json()).then(({ data }) => { if (data.title) localStorage.setItem('SS_DRAFT_TITLE', data.title); if (data.description) localStorage.setItem('SS_DRAFT_DESC', data.description || ''); setVideoFormat(data.videoFormat); const matching: string[] = []; const names = new Set(data.platforms.map((pl: { platform: string }) => pl.platform)); accounts.forEach(acc => { const pName = acc.provider === 'google' ? 'youtube' : acc.provider; if (names.has(pName)) { if (acc.provider === 'facebook') matching.push(`facebook:${acc.id}`, `instagram:${acc.id}`); else matching.push(acc.id); } }); if (matching.length > 0) setSelectedAccountIds(matching); setUploadStatus(` Ready to resume: "${data.title}"`); }).catch(console.error);
    }
  }, [resumeId, accounts, setSelectedAccountIds, setUploadStatus, setVideoFormat]);

  useEffect(() => {
    if (stagedId) fetch(`/api/media`).then(r => r.json()).then(d => { const a = d.data?.find((as: Asset) => as.fileId === stagedId); if (a) { setGalleryFileId(a.fileId); setGalleryFileName(a.fileName); setUploadStatus(` Ready to post: ${a.fileName}`); } }).catch(console.error);
  }, [stagedId, setUploadStatus]);

  return <DashboardView session={p.session} isReviewing={isReviewing} aiPreviews={aiPreviews} isUploading={isUploading} devAccounts={devAccounts} preferences={preferences} selectedAccountIds={selectedAccountIds} contentMode={contentMode} aiTier={aiTier} aiProvider={aiProvider} videoFormat={videoFormat} videoDuration={null} draftFileName={galleryFileName || draftFileName} isScheduled={isScheduled} scheduledAt={scheduledAt} customStyleText={customStyleText} onBack={() => { setIsReviewing(false); setUploadStatus(''); }} onConfirm={(v) => onConfirm(v, reviewContext)} onVisualScan={async (file) => { setUploadStatus(' Scanning video...'); const frames = await extractVideoFrames(file), pl = (preferences || []).filter(pr => pr.isEnabled); const { getMultiPlatformAIPreviews } = await import('@/app/actions/ai'); setAiPreviews(await getMultiPlatformAIPreviews('', '', 'Generate', contentMode, pl.map(pr => pr.platformId), frames, customStyleText, byokConfigs, aiProvider)); setIsReviewing(true); }} onTierChange={setAiTier} onProviderChange={setAiProvider} onModeChange={setContentMode} onToggleAccount={handleToggleAccount} onFileChange={(f) => { setGalleryFileId(null); setGalleryFileName(null); handleFileChange(f); setAiPreviews({}); }} onGallerySelect={(id, n) => { setGalleryFileId(id); setGalleryFileName(n); handleFileChange(null); setUploadStatus(` Selected: ${n}`); setAiPreviews({}); }} onSubmit={onSubmit} onSchedulingChange={(s, d) => { setIsScheduled(s); setScheduledAt(d); }} onCustomStyleChange={setCustomStyleText} onResumeReview={() => setIsReviewing(true)} initialByosConfig={p.initialByosConfig} />;
}
