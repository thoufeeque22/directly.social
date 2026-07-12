import React from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from '@/app/(dashboard)/schedule/schedule.module.css';
import { ScheduleViewToggles } from './ScheduleViewToggles';

export interface ScheduleHeaderProps {
  viewMode: 'timeline' | 'month' | 'week';
  currentDate: Date | null;
  onNext: () => void;
  onPrev: () => void;
  onToday: () => void;
  onViewChange: (mode: 'timeline' | 'month' | 'week') => void;
}

export function ScheduleHeader({
  viewMode,
  currentDate,
  onNext,
  onPrev,
  onToday,
  onViewChange
}: ScheduleHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerTop} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className={styles.title}>Scheduled Posts</h1>
          <p className={styles.subtitle} style={{ marginTop: '0.25rem' }}>
            Manage your upcoming content distribution
          </p>
        </div>

        {(viewMode === 'month' || viewMode === 'week') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <IconButton onClick={onPrev} data-testid="calendar-prev-btn" size="small" sx={{ color: 'hsl(var(--foreground))', background: 'hsla(var(--muted)/0.2)' }}>
              <ChevronLeftIcon />
            </IconButton>
            <button onClick={onToday} data-testid="calendar-today-btn" style={{ background: 'transparent', border: '1px solid hsla(var(--border)/0.4)', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', color: 'hsl(var(--foreground))', fontWeight: 600, fontSize: '0.85rem' }}>
              Today
            </button>
            <span data-testid="calendar-current-period" style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '140px', textAlign: 'center', color: 'hsl(var(--foreground))' }}>
              {currentDate && (viewMode === 'month' 
                ? format(currentDate, 'MMMM yyyy')
                : `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
              )}
            </span>
            <IconButton onClick={onNext} data-testid="calendar-next-btn" size="small" sx={{ color: 'hsl(var(--foreground))', background: 'hsla(var(--muted)/0.2)' }}>
              <ChevronRightIcon />
            </IconButton>
          </div>
        )}

        <ScheduleViewToggles viewMode={viewMode} onViewChange={onViewChange} />
      </div>
    </div>
  );
}
