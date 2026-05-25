import React from 'react';
import styles from '@/app/history/history.module.css';

interface HistoryCardHeaderProps {
  title: string;
  description?: string | null;
  isCardActive: boolean;
  isOptimistic: boolean;
  isPostCancelled: boolean;
}

export function HistoryCardHeader({
  title,
  description,
  isCardActive,
  isOptimistic,
  isPostCancelled
}: HistoryCardHeaderProps) {
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
