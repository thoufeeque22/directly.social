import React from 'react';
import { PostHistoryEntry, PlatformResult } from '@/hooks/useHistory';
import { PlatformResultItem } from './PlatformResultItem';
import styles from '@/app/history/history.module.css';

interface HistoryPlatformListProps {
  post: PostHistoryEntry;
  cancelledIds: string[];
  processingIds: string[];
  onRetry: (e: React.MouseEvent, p: PlatformResult) => void;
  onCancel: (e: React.MouseEvent, resultId: string, platform?: string, historyId?: string) => void;
}

export function HistoryPlatformList({
  post,
  cancelledIds,
  processingIds,
  onRetry,
  onCancel
}: HistoryPlatformListProps) {
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
          />
        ))}
    </div>
  );
}
