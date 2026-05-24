import React from 'react';
import { HistoryCard } from './HistoryCard';
import styles from '@/app/history/history.module.css';

import { PostHistoryEntry, PlatformResult } from '@/hooks/useHistory';
import { UploadStatus } from '@/hooks/useUploadStatus';

interface HistoryListProps {
  posts: PostHistoryEntry[];
  cancelledIds: string[];
  processingIds: string[];
  activeResumingId: string | null;
  stagingStatus: UploadStatus;
  onRetry: (e: React.MouseEvent, p: PlatformResult) => void;
  onCancelPlatform: (e: React.MouseEvent, resultId: string, platform?: string, historyId?: string) => void;
  onCancelAll: (e: React.MouseEvent, historyId: string) => void;
  onInPlaceResume: (post: PostHistoryEntry) => void;
  nextCursor: string | null;
  loadingMore: boolean;
  onLoadMore: () => void;
  now: number;
}


export function HistoryList({
  posts, cancelledIds, processingIds, activeResumingId, stagingStatus,
  onRetry, onCancelPlatform, onCancelAll, onInPlaceResume,
  nextCursor, loadingMore, onLoadMore, now
}: HistoryListProps) {
  return (
    <div className={styles.timeline}>
      {posts.map((post) => (
        <HistoryCard
          key={post.id}
          post={post}
          cancelledIds={cancelledIds}
          processingIds={processingIds}
          activeResumingId={activeResumingId}
          stagingStatus={stagingStatus}
          onRetry={onRetry}
          onCancelPlatform={onCancelPlatform}
          onCancelAll={onCancelAll}
          onInPlaceResume={onInPlaceResume}
          now={now}
        />
      ))}

      {nextCursor && (
        <button className={styles.loadMoreButton} onClick={onLoadMore} disabled={loadingMore}>
          {loadingMore ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
