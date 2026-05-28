import React from 'react';
import { PostActivityEntry, PlatformResult } from '@/hooks/useActivity';
import { UploadStatus } from '@/hooks/useUploadStatus';

export interface ActivityCardProps {
  post: PostActivityEntry;
  cancelledIds: string[];
  processingIds: string[];
  activeResumingId: string | null;
  stagingStatus: UploadStatus;
  onRetry: (e: React.MouseEvent, p: PlatformResult) => void;
  onCancelPlatform: (e: React.MouseEvent, resultId: string, platform?: string, activityId?: string) => void;
  onCancelAll: (e: React.MouseEvent, activityId: string) => void;
  onInPlaceResume: (post: PostActivityEntry) => void;
  now: number;
}
