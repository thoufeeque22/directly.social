import React from 'react';
import { ActivityCard } from './ActivityCard';
import styles from '@/app/activity/activity.module.css';

import { PostActivityEntry, PlatformResult } from '@/hooks/useActivity';
import { UploadStatus } from '@/hooks/useUploadStatus';

// TODO: Refactor: logic extraction needed
interface ActivityListProps {
  posts: PostActivityEntry[];
  cancelledIds: string[];
  processingIds: string[];
  activeResumingId: string | null;
  stagingStatus: UploadStatus;
  onRetry: (e: React.MouseEvent, p: PlatformResult) => void;
  onCancelPlatform: (e: React.MouseEvent, resultId: string, platform?: string, activityId?: string) => void;
  onCancelAll: (e: React.MouseEvent, activityId: string) => void;
  onInPlaceResume: (post: PostActivityEntry) => void;
  nextCursor: string | null;
  loadingMore: boolean;
  onLoadMore: () => void;
  now: number;
}


export function ActivityList({
  posts, cancelledIds, processingIds, activeResumingId, stagingStatus,
  onRetry, onCancelPlatform, onCancelAll, onInPlaceResume,
  nextCursor, loadingMore, onLoadMore, now
}: ActivityListProps) {
  return (
    <div className={styles.timeline}>
      {posts.map((post) => (
        <ActivityCard
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
