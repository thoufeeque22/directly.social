import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ScheduleContent } from './ScheduleContent';
import styles from './schedule.module.css';

export const metadata: Metadata = {
  title: "Schedule",
};

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className={styles.schedulePage}><div className={styles.loading}>Loading scheduled posts...</div></div>}>
      <ScheduleContent />
    </Suspense>
  );
}
