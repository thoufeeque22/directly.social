'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useAccounts } from '@/hooks/useAccounts';
import { useDraftFile } from '@/hooks/dashboard/useDraftFile';
import { usePlatformSelection } from '@/hooks/dashboard/usePlatformSelection';
import { useAiByok } from '@/hooks/useAiByok';
import { DashboardView } from './DashboardViewWrapper';
import { DashboardClientProps } from './DashboardClient.types';
import {
  useDashboardDevAccounts,
  useDashboardAIState,
  useDashboardUploadEngine,
  useDashboardAIPreviews,
} from './DashboardClient.hooks';
import { useDashboardHandlers } from './DashboardClient.handlers';
import { useDashboardInitialization } from '@/hooks/dashboard/useDashboardInitialization';
import { useDashboardLocalState } from '@/hooks/dashboard/useDashboardLocalState';
import { useRouter } from 'next/navigation';

export default function DashboardClient(p: Readonly<DashboardClientProps>) {
  const s = useSearchParams(), resumeId = s.get('resume'), stagedId = s.get('staged');
  const router = useRouter();
  const { update } = useSession();
  const { accounts, isLoading, preferences } = useAccounts(p.initialAccounts, p.initialPreferences);
  const { configs: byokConfigs } = useAiByok();
  const devAccounts = useDashboardDevAccounts(accounts, p.session?.user?.id);
  const {
    draftFileName, videoFormat, setVideoFormat, handleFileChange, videoDuration, draftFile,
  } = useDraftFile(p.session?.user?.id);
  const { selectedAccountIds, setSelectedAccountIds, handleToggleAccount } = usePlatformSelection(
    devAccounts, preferences, isLoading
  );
  const { isUploading, setIsUploading, setUploadStatus } = useDashboardUploadEngine(devAccounts);
  const { aiTier, setAiTier, aiProvider, setAiProvider, contentMode, setContentMode } =
    useDashboardAIState(p.initialAITier, p.initialAIStyle, p.initialAIProvider || 'gemini');
  const { aiPreviews, setAiPreviews, clearCache } = useDashboardAIPreviews();
  const st = useDashboardLocalState();

  useDashboardInitialization({
    resumeId, stagedId, accounts, preferences, setVideoFormat, setSelectedAccountIds, setUploadStatus,
    setGalleryFileId: st.setGalleryFileId, setGalleryFileName: st.setGalleryFileName,
  });

  const h = useDashboardHandlers(
    resumeId, stagedId, devAccounts, selectedAccountIds, aiTier, contentMode, aiProvider,
    st.customStyleText, byokConfigs, videoFormat, draftFileName, st.galleryFileId, st.galleryFileName,
    st.isScheduled, st.scheduledAt, setUploadStatus, st.setIsReviewing, setAiPreviews,
    st.setReviewContext, setIsUploading, clearCache, preferences, handleFileChange,
    st.setGalleryFileId, st.setGalleryFileName, update, router
  );

  return (
    <DashboardView
      props={p}
      state={{
        ...st, aiPreviews, isUploading, devAccounts, preferences, selectedAccountIds,
        contentMode, aiTier, aiProvider, videoFormat, videoDuration,
        draftFileName: st.galleryFileName || draftFileName, draftFile,
      }}
      handlers={{
        ...h,
        onBack: () => { st.setIsReviewing(false); setUploadStatus(''); },
        onConfirm: (v) => h.onConfirm(v, st.reviewContext),
        onVisualScan: h.handleVisualScan,
        onFileChange: h.handleFileChange,
        onGallerySelect: h.handleGallerySelect,
        onTierChange: setAiTier, onProviderChange: setAiProvider, onModeChange: setContentMode,
        onToggleAccount: handleToggleAccount,
        onSchedulingChange: (s, d) => { st.setIsScheduled(s); st.setScheduledAt(d); },
        onCustomStyleChange: st.setCustomStyleText,
        onResumeReview: () => st.setIsReviewing(true),
      }}
    />
  );
}
