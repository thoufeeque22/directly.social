import React from 'react';
import ActivityIcon from '@mui/icons-material/History';
import styles from '@/app/activity/activity.module.css';

interface ActivityEmptyStateProps {
  searchQuery: string;
}

export function ActivityEmptyState({ searchQuery }: ActivityEmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <ActivityIcon sx={{ fontSize: 48, opacity: 0.5 }} />
      </div>
      <h3 className={styles.emptyTitle}>{searchQuery ? 'No matching activity' : 'No activity yet'}</h3>
      <p className={styles.emptyDescription}>
        {searchQuery ? `We couldn't find any posts matching "${searchQuery}"` : 'Upload a video from the dashboard to see its distribution status here.'}
      </p>
    </div>
  );
}
