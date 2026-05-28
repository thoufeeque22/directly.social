import React from 'react';
import styles from '@/app/activity/activity.module.css';

interface ActivityCardHeaderProps {
  title: string;
  description?: string | null;
  isCardActive: boolean;
  isOptimistic: boolean;
  isPostCancelled: boolean;
}

export function ActivityCardHeader({
  title,
  description,
  isCardActive,
  isOptimistic,
  isPostCancelled
}: ActivityCardHeaderProps) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h3 className={styles.postTitle}>
        {isCardActive && <span className={styles.processingDot} />}
        {title} {isOptimistic && !isPostCancelled && <span style={{ opacity: 0.6, fontSize: '0.8em' }}>(Initializing)</span>}
      </h3>
      {description && (
        <p className={styles.postDescription}>{description}</p>
      )}
    </div>
  );
}
