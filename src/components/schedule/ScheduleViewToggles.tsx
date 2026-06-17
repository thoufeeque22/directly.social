import React from 'react';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export interface ScheduleViewTogglesProps {
  viewMode: 'timeline' | 'month' | 'week';
  onViewChange: (mode: 'timeline' | 'month' | 'week') => void;
}

export function ScheduleViewToggles({ viewMode, onViewChange }: ScheduleViewTogglesProps) {
  const btnStyle = (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    borderRadius: '8px',
    border: 'none',
    background: active ? 'hsla(var(--primary)/0.15)' : 'transparent',
    color: active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ display: 'flex', background: 'hsla(var(--muted)/0.1)', padding: '4px', borderRadius: '10px', border: '1px solid hsla(var(--border)/0.4)' }}>
      <button onClick={() => onViewChange('timeline')} style={btnStyle(viewMode === 'timeline')}>
        <ViewHeadlineIcon sx={{ fontSize: 18 }} /> Timeline
      </button>
      <button onClick={() => onViewChange('month')} style={btnStyle(viewMode === 'month')}>
        <CalendarMonthIcon sx={{ fontSize: 18 }} /> Month
      </button>
      <button onClick={() => onViewChange('week')} style={btnStyle(viewMode === 'week')}>
        <CalendarMonthIcon sx={{ fontSize: 18 }} /> Week
      </button>
    </div>
  );
}
