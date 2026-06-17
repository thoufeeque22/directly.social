import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import styles from '@/app/schedule/schedule.module.css';

export function ScheduleEmptyState() {
  return (
    <GlassCard>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <CalendarMonthIcon sx={{ fontSize: 48, opacity: 0.5 }} />
        </div>
        <h3 className={styles.emptyTitle}>No scheduled posts</h3>
        <p className={styles.emptyDescription}>
          Plan your content ahead of time from the Dashboard, and it will appear here.
        </p>
      </div>
    </GlassCard>
  );
}
