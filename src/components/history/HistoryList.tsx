import React from 'react';
import { HistoryCard } from './HistoryCard';
import styles from '@/app/history/history.module.css';

interface HistoryListProps {
  posts: any[];
  cancelledIds: string[];
  processingIds: string[];
  activeResumingId: string | null;
  stagingStatus: any;
  onRetry: (e: React.MouseEvent, p: any) => void;
  onCancelPlatform: (e: React.MouseEvent, id: string, platform?: string, hId?: string) => void;
  onCancelAll: (e: React.MouseEvent, hId: string) => void;
  onInPlaceResume: (post: any) => void;
  nextCursor: string | null;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export function HistoryList({
  posts, cancelledIds, processingIds, activeResumingId, stagingStatus,
  onRetry, onCancelPlatform, onCancelAll, onInPlaceResume,
  nextCursor, loadingMore, onLoadMore
}: HistoryListProps) {
  return (
    <div className={styles.timeline}>
      {posts.map((post) => (
        <HistoryCard
          key={post.id || post.resumeHistoryId || 'optimistic'}
          post={post}
          cancelledIds={cancelledIds}
          processingIds={processingIds}
          activeResumingId={activeResumingId}
          stagingStatus={stagingStatus}
          onRetry={onRetry}
          onCancelPlatform={onCancelPlatform}
          onCancelAll={onCancelAll}
          onInPlaceResume={onInPlaceResume}
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
