'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { StyleMode, AITier } from '@/lib/core/constants';
import { Account, PlatformPreference } from '@/lib/core/types';
import { useUploadForm } from '@/hooks/dashboard/useUploadForm';

export interface UploadFormProps {
  isUploading: boolean;
  accounts: Account[];
  preferences: PlatformPreference[];
  selectedAccountIds: string[];
  contentMode: StyleMode;
  aiTier: AITier;
  videoFormat: 'short' | 'long';
  videoDuration: number | null;
  draftFileName: string | null;
  isScheduled: boolean;
  scheduledAt: string;
  customStyleText: string;
  hasCachedPreviews?: boolean;
  onVisualScan: (file: File) => Promise<void>;
  onTierChange: (tier: AITier) => void;
  onModeChange: (mode: StyleMode) => void;
  onToggleAccount: (id: string) => void;
  onFileChange: (file: File | null) => void;
  onGallerySelect: (fileId: string, fileName: string) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  onSchedulingChange: (isScheduled: boolean, date: string) => void;
  onCustomStyleChange: (text: string) => void;
  onResumeReview?: () => void;
}

export interface UploadFormContextType extends UploadFormProps {
  // From useUploadForm
  title: string;
  description: string;
  platformTitles: Record<string, string>;
  platformDescriptions: Record<string, string>;
  isPlatformSpecific: boolean;
  titleUndo: string | null;
  descUndo: string | null;
  
  // Additional Actions
  handleTitleChange: (val: string) => void;
  handleDescriptionChange: (val: string) => void;
  appendDescription: (val: string, platform?: string) => void;
  handlePlatformTitleChange: (platform: string, val: string) => void;
  handlePlatformDescriptionChange: (platform: string, val: string) => void;
  togglePlatformSpecific: (val: boolean) => void;
  handleClearTitle: () => void;
  handleUndoTitle: () => void;
  handleClearDesc: () => void;
  handleUndoDesc: () => void;

  // Derived
  selectedPlatforms: string[];
  byosActive: boolean;
  byosProvider: 'S3' | 'R2' | null;
  showGallery: boolean;
  setShowGallery: (val: boolean) => void;
}

const UploadFormContext = createContext<UploadFormContextType | undefined>(undefined);

export const UploadFormProvider: React.FC<{
  children: React.ReactNode;
  props: UploadFormProps;
}> = ({ children, props }) => {
  const uploadFormState = useUploadForm();
  const [showGallery, setShowGallery] = useState(false);
  const [byosActive, setByosActive] = useState(false);
  const [byosProvider, setByosProvider] = useState<'S3' | 'R2' | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/settings/byos', { signal: controller.signal })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.config) {
          setByosActive(true);
          setByosProvider(data.config.provider);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const selectedPlatforms = useMemo(() => {
    const platformsSet = new Set<string>();
    props.selectedAccountIds.forEach((id: string) => {
      const isSplit = id.includes(':');
      const platformKey = isSplit ? id.split(':')[0] : null;
      const actualAccountId = isSplit ? id.split(':')[1] : id;
      const account = props.accounts.find((a: Account) => a.id === actualAccountId);
      if (isSplit && platformKey) {
        platformsSet.add(platformKey);
      } else if (account) {
        platformsSet.add(account.provider === 'google' ? 'youtube' : account.provider);
      }
    });
    return Array.from(platformsSet);
  }, [props.selectedAccountIds, props.accounts]);

  const value = {
    ...props,
    ...uploadFormState,
    selectedPlatforms,
    byosActive,
    byosProvider,
    showGallery,
    setShowGallery
  };

  return (
    <UploadFormContext.Provider value={value}>
      {children}
    </UploadFormContext.Provider>
  );
};

export const useUploadFormContext = () => {
  const context = useContext(UploadFormContext);
  if (!context) {
    throw new Error('useUploadFormContext must be used within an UploadFormProvider');
  }
  return context;
};
