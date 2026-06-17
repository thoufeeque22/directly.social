'use client';

import React from 'react';
import styles from './calendar.module.css';
import { PostActivityEntry } from '@/app/schedule/types';
import { CalendarMonthView } from './CalendarMonthView';
import { CalendarWeekView } from './CalendarWeekView';

interface CalendarViewProps {
  posts: PostActivityEntry[];
  currentDate: Date;
  viewType: 'month' | 'week';
  onEditPost: (post: PostActivityEntry) => void;
}

export function CalendarView({ 
  posts, 
  currentDate, 
  viewType, 
  onEditPost 
}: CalendarViewProps) {
  return (
    <div className={styles.calendarContainer}>
      {viewType === 'month' ? (
        <CalendarMonthView 
          posts={posts} 
          currentDate={currentDate} 
          onEditPost={onEditPost} 
        />
      ) : (
        <CalendarWeekView 
          posts={posts} 
          currentDate={currentDate} 
          onEditPost={onEditPost} 
        />
      )}
    </div>
  );
}
