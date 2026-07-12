import React from 'react';
import styles from '@/app/(dashboard)/activity/activity.module.css';

interface ActivityHeaderProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ActivityHeader({ fileInputRef }: ActivityHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerTop}>
        <h1 className={styles.title}>Activity Hub</h1>
      </div>
      <p className={styles.subtitle}>
        Track and manage your video distribution in real-time.
      </p>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="video/*" />
    </div>
  );
}
