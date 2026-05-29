/* eslint-disable max-lines */
import { StyleMode, AITier } from '@/lib/core/constants';
import { Account, PlatformPreference } from '@/lib/core/types';
import { AIProvider } from '@/lib/core/ai';

export interface UploadFormProps {
  isUploading: boolean;
  accounts: Account[];
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
  hasCachedPreviews?: boolean;
  onVisualScan: (file: File) => Promise<void>;
  onTierChange: (tier: AITier) => void;
  onProviderChange: (provider: AIProvider) => void;
  onModeChange: (mode: StyleMode) => void;
  onToggleAccount: (id: string) => void;
  onFileChange: (file: File | null) => void;
  onGallerySelect: (fileId: string, fileName: string) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  onSchedulingChange: (isScheduled: boolean, date: string) => void;
  onCustomStyleChange: (text: string) => void;
  onResumeReview?: () => void;
  initialByosConfig?: { provider: string; bucketName: string } | null;
}

export interface UploadFormContextType extends UploadFormProps {
  title: string;
  description: string;
  platformTitles: Record<string, string>;
  platformDescriptions: Record<string, string>;
  isPlatformSpecific: boolean;
  titleUndo: string | null;
  descUndo: string | null;
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
  selectedPlatforms: string[];
  byosActive: boolean;
  byosProvider: 'S3' | 'R2' | null;
  showGallery: boolean;
  setShowGallery: (val: boolean) => void;
}
