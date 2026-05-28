import { Session } from 'next-auth';
import { Account, PlatformPreference } from '@/lib/core/types';
import { StyleMode, AITier } from '@/lib/core/constants';
import { AIProvider } from '@/lib/core/ai';

export interface ReviewContext {
  stagedFileId: string;
  fileName: string;
  activityId: string;
  formData: FormData;
  targetAccountIds?: string[];
}

export interface Asset {
  fileId: string;
  fileName: string;
}

export interface DashboardClientProps {
  session: Session;
  initialAccounts: Account[];
  initialPreferences: PlatformPreference[];
  initialAIStyle: StyleMode;
  initialAITier: AITier;
  initialAIProvider?: AIProvider;
}
