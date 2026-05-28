import React from 'react';
import { PostActivityEntry, PlatformResult } from '@/hooks/useActivity';
import { PlatformResultItem } from './PlatformResultItem';
import styles from '@/app/activity/activity.module.css';

interface ActivityPlatformListProps {
  post: PostActivityEntry;
  cancelledIds: string[];
  processingIds: string[];
  onRetry: (e: React.MouseEvent, p: PlatformResult) => void;
  onCancel: (e: React.MouseEvent, resultId: string, platform?: string, activityId?: string) => void;
  now: number;
}

export function ActivityPlatformList({
  post,
  cancelledIds,
  processingIds,
  onRetry,
  onCancel,
  now
}: ActivityPlatformListProps) {
  return (
    <div className={styles.platformRow}>
      {[...post.platforms]
        .sort((a, b) => a.platform.localeCompare(b.platform))
        .map(p => (
          <PlatformResultItem
            key={p.id}
            p={p}
            post={post}
            cancelledIds={cancelledIds}
            processingIds={processingIds}
            onRetry={onRetry}
            onCancel={onCancel}
            now={now}
          />
        ))}
    </div>
  );
}
