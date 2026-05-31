'use client';

import React from 'react';
import { DashboardView as BaseDashboardView } from './DashboardClient.View';
import { DashboardClientProps, ReviewContext } from './DashboardClient.types';
import { Account, PlatformPreference, VideoFormat } from '@/lib/core/types';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { AITier, StyleMode } from '@/lib/core/constants';
import { AIProvider } from '@/lib/core/ai';

interface DashboardState {
  isReviewing: boolean;
  aiPreviews: Record<string, AIWriteResult>;
  isUploading: boolean;
  devAccounts: Account[];
  preferences: PlatformPreference[] | undefined;
  selectedAccountIds: string[];
  contentMode: StyleMode;
  aiTier: AITier;
  aiProvider: AIProvider;
  videoFormat: VideoFormat;
  videoDuration: number | null;
  draftFileName: string | null;
  draftFile: File | null;
  isScheduled: boolean;
  scheduledAt: string;
  customStyleText: string;
  reviewContext: ReviewContext | null;
  galleryFileId: string | null;
  galleryFileName: string | null;
}

interface DashboardHandlers {
  onBack: () => void;
  onConfirm: (v: Record<string, AIWriteResult>) => void;
  onVisualScan: (file: File) => Promise<void>;
  onTierChange: (tier: AITier) => void;
  onProviderChange: (provider: AIProvider) => void;
  onModeChange: (mode: StyleMode) => void;
  onToggleAccount: (id: string) => void;
  onFileChange: (file: File | null) => void;
  onGallerySelect: (id: string, name: string) => void;
  onSubmit: (fd: FormData) => Promise<void>;
  onSchedulingChange: (scheduled: boolean, date: string) => void;
  onCustomStyleChange: (text: string) => void;
  onResumeReview: () => void;
}

interface DashboardViewWrapperProps {
  props: DashboardClientProps;
  state: DashboardState;
  handlers: DashboardHandlers;
}

export function DashboardView({ props, state, handlers }: DashboardViewWrapperProps) {
  return (
    <BaseDashboardView
      session={props.session}
      initialByosConfig={props.initialByosConfig}
      {...state}
      preferences={state.preferences || []}
      {...handlers}
    />
  );
}
