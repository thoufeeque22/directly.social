/* eslint-disable max-lines */
'use client';

import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AIContentReview } from '@/components/dashboard/AIContentReview';
import { UploadForm } from '@/components/dashboard/UploadForm';
import { SidebarInfo } from '@/components/dashboard/SidebarInfo';
import { StyleMode, AITier } from '@/lib/core/constants';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import type { Session } from 'next-auth';
import { Account, PlatformPreference } from '@/lib/core/types';
import { AIProvider } from '@/lib/core/ai';

interface ViewProps {
  session: Session;
  isReviewing: boolean;
  aiPreviews: Record<string, AIWriteResult>;
  isUploading: boolean;
  devAccounts: Account[];
  preferences: PlatformPreference[];
  selectedAccountIds: string[];
  contentMode: StyleMode;
  aiTier: AITier;
  aiProvider: AIProvider;
  videoFormat: 'short' | 'long';
  videoDuration: number | null;
  draftFileName: string | null;
  isScheduled: boolean;
  scheduledAt: string;
  customStyleText: string;
  onBack: () => void;
  onConfirm: (v: Record<string, AIWriteResult>) => void;
  onVisualScan: (f: File) => Promise<void>;
  onTierChange: (t: AITier) => void;
  onProviderChange: (p: AIProvider) => void;
  onModeChange: (m: StyleMode) => void;
  onToggleAccount: (id: string) => void;
  onFileChange: (f: File | null) => void;
  onGallerySelect: (id: string, n: string) => void;
  onSubmit: (d: FormData) => Promise<void>;
  onSchedulingChange: (s: boolean, d: string) => void;
  onCustomStyleChange: (t: string) => void;
  onResumeReview: () => void;
}

export const DashboardView: React.FC<ViewProps> = (p) => (
  <div className="fade-in">
    <DashboardHeader session={p.session} />
    <div className="responsive-grid">
      {p.isReviewing ? (
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <AIContentReview previews={p.aiPreviews} onBack={p.onBack} onConfirm={p.onConfirm} isProcessing={p.isUploading} />
        </div>
      ) : (
        <UploadForm 
          isUploading={p.isUploading} accounts={p.devAccounts} preferences={p.preferences} selectedAccountIds={p.selectedAccountIds} contentMode={p.contentMode} aiTier={p.aiTier} aiProvider={p.aiProvider} videoFormat={p.videoFormat} videoDuration={p.videoDuration} draftFileName={p.draftFileName}
          onVisualScan={p.onVisualScan} onTierChange={p.onTierChange} onProviderChange={p.onProviderChange} onModeChange={p.onModeChange} onToggleAccount={p.onToggleAccount}
          onFileChange={p.onFileChange} onGallerySelect={p.onGallerySelect} onSubmit={p.onSubmit} isScheduled={p.isScheduled} scheduledAt={p.scheduledAt} onSchedulingChange={p.onSchedulingChange}
          customStyleText={p.customStyleText} onCustomStyleChange={p.onCustomStyleChange} hasCachedPreviews={Object.keys(p.aiPreviews).length > 0} onResumeReview={p.onResumeReview}
        />
      )}
      <SidebarInfo />
    </div>
  </div>
);
