import React from 'react';
import { PostHistoryEntry, PlatformResult } from '@/hooks/useHistory';
import { UploadStatus } from '@/hooks/useUploadStatus';

export interface HistoryCardProps {
  post: PostHistoryEntry;
  cancelledIds: string[];
  processingIds: string[];
  activeResumingId: string | null;
  stagingStatus: UploadStatus;
  onRetry: (e: React.MouseEvent, p: PlatformResult) => void;
  onCancelPlatform: (e: React.MouseEvent, resultId: string, platform?: string, historyId?: string) => void;
  onCancelAll: (e: React.MouseEvent, historyId: string) => void;
  onInPlaceResume: (post: PostHistoryEntry) => void;
  now: number;
}
