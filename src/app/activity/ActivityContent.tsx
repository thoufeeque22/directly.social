'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useUploadStatus } from '@/hooks/useUploadStatus';
import { useActivity } from '@/hooks/useActivity';
import { ActivityFilters } from '@/components/activity/ActivityFilters';
import { ActivityHeader } from '@/components/activity/ActivityHeader';
import { ActivityEmptyState } from '@/components/activity/ActivityEmptyState';
import { ActivityList } from '@/components/activity/ActivityList';
import styles from './activity.module.css';

export function ActivityContent() {
  const activity = useActivity();
  const stagingStatus = useUploadStatus();
  const [now, setNow] = React.useState(0);

  React.useEffect(() => {
    setNow(Date.now());
  }, []);

  return (
    <div className={styles.activityPage}>
      <ActivityHeader fileInputRef={activity.fileInputRef} />
      <GlassCard style={{ padding: '2rem' }}>
        <ActivityFilters searchQuery={activity.searchQuery} setSearchQuery={activity.setSearchQuery} />
        {activity.reconciledPosts.length === 0 ? (
          <ActivityEmptyState searchQuery={activity.searchQuery} />
        ) : (
          <ActivityList
            posts={activity.reconciledPosts}
            cancelledIds={activity.cancelledIds}
            processingIds={activity.processingIds}
            activeResumingId={activity.activeResumingId}
            stagingStatus={stagingStatus}
            onRetry={activity.handleRetry}
            onCancelPlatform={activity.handleCancelPlatform}
            onCancelAll={activity.handleCancelAll}
            onInPlaceResume={activity.handleInPlaceResume}
            nextCursor={activity.nextCursor}
            loadingMore={activity.loadingMore}
            onLoadMore={activity.handleLoadMore}
            now={now}
          />
        )}
      </GlassCard>
    </div>
  );
}
