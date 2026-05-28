'use client';

import React from 'react';
import { ActivityContent } from './ActivityContent';
import styles from './activity.module.css';

export default function ActivityPage() {
  return (
    <React.Suspense fallback={
      <div className={styles.activityPage}>
        <div className={styles.loading}>Loading Activity Hub...</div>
      </div>
    }>
      <ActivityContent />
    </React.Suspense>
  );
}
