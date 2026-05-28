/* eslint-disable max-lines */
'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useUploadStatus } from '@/hooks/useUploadStatus';
import { useActivity, PostActivityEntry } from '@/hooks/useActivity';
import { ActivityFilters } from '@/components/activity/ActivityFilters';
import { ActivityHeader } from '@/components/activity/ActivityHeader';
import { ActivityEmptyState } from '@/components/activity/ActivityEmptyState';
import { ActivityList } from '@/components/activity/ActivityList';
import styles from './activity.module.css';

// TODO: Refactor: logic extraction needed
function ActivityContent() {
  const {
    posts, pendingPost, nextCursor, loadingMore, activeResumingId,
    searchQuery, setSearchQuery, cancelledIds, processingIds,
    handleLoadMore, handleRetry, handleCancelPlatform, handleCancelAll,
    handleInPlaceResume, fileInputRef,
  } = useActivity();

  const stagingStatus = useUploadStatus();
  const reconciledPosts = React.useMemo(() => {
    if (!pendingPost) return posts;
    const optimisticPost: PostActivityEntry = {
      ...pendingPost,
      id: pendingPost.resumeActivityId || 'optimistic-pending',
      createdAt: new Date().toISOString(),
      description: pendingPost.description || null,
      stagedFileId: pendingPost.stagedFileId || null,
      isOptimistic: true,
    };
    return [optimisticPost, ...posts];
  }, [pendingPost, posts]);

  const [now] = React.useState(() => Date.now());

  return (
    <div className={styles.activityPage}>
      <ActivityHeader fileInputRef={fileInputRef} />
      <GlassCard style={{ padding: '2rem' }}>
        <ActivityFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {reconciledPosts.length === 0 ? (
          <ActivityEmptyState searchQuery={searchQuery} />
        ) : (
          <ActivityList
            posts={reconciledPosts}
            cancelledIds={cancelledIds}
            processingIds={processingIds}
            activeResumingId={activeResumingId}
            stagingStatus={stagingStatus}
            onRetry={handleRetry}
            onCancelPlatform={handleCancelPlatform}
            onCancelAll={handleCancelAll}
            onInPlaceResume={handleInPlaceResume}
            nextCursor={nextCursor}
            loadingMore={loadingMore}
            onLoadMore={handleLoadMore}
            now={now}
          />
        )}
      </GlassCard>
    </div>
  );
}

export default function ActivityPage() {
  return (
    <React.Suspense fallback={<div className={styles.activityPage}><div className={styles.loading}>Loading Activity Hub...</div></div>}>
      <ActivityContent />
    </React.Suspense>
  );
}
