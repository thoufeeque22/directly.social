import { z } from 'zod';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { StyleMode } from '@/lib/core/constants';

// TODO: Refactor: logic extraction needed
export const PendingPostSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  videoFormat: z.string(),
  platforms: z.array(z.object({
    platform: z.string(),
    accountId: z.string().nullable(),
  })),
});

export interface PlatformResult {
  id: string;
  platform: string;
  accountName: string | null;
  platformPostId: string | null;
  permalink: string | null;
  status: string;
  progress: number;
  errorMessage: string | null;
  accountId: string | null;
}

export interface PostHistoryEntry {
  id: string;
  title: string;
  description: string | null;
  videoFormat: string;
  createdAt: string;
  stagedFileId: string | null;
  platforms: PlatformResult[];
  isOptimistic?: boolean;
}

export interface CockpitPost {
  title: string;
  description?: string;
  videoFormat: string;
  platforms: PlatformResult[];
  resumeHistoryId?: string;
  galleryFileId?: string;
  galleryFileName?: string;
  isScheduled?: boolean;
  scheduledAt?: string;
  aiTier?: string;
  skipReview?: boolean;
  contentMode?: StyleMode;
  customStyleText?: string;
  stagedFileId?: string;
  fileName?: string;
  historyId?: string;
}
