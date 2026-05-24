import React from 'react';
import { PostHistoryEntry, PlatformResult } from '@/hooks/useHistory';

export interface HistoryCardProps {
  post: PostHistoryEntry;
  cancelledIds: string[];
  processingIds: string[];
  activeResumingId: string | null;
  stagingStatus: { active: boolean; historyId?: string; percent?: number; status?: string };
  onRetry: (e: React.MouseEvent, p: PlatformResult) => void;
  onCancelPlatform: (e: React.MouseEvent, resultId: string, platform?: string, historyId?: string) => void;
  onCancelAll: (e: React.MouseEvent, historyId: string) => void;
  onInPlaceResume: (post: PostHistoryEntry) => void;
}
