import React from 'react';
import { Metadata } from 'next';
import { ActivityContent } from './ActivityContent';
import styles from './activity.module.css';

export const metadata: Metadata = {
  title: "History | SocialStudio",
};

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
