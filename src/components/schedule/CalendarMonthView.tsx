'use client';

import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Tooltip } from '@mui/material';
import styles from './calendar.module.css';
import { PostActivityEntry } from '@/app/(dashboard)/schedule/types';
import { getPlatformClass } from './calendarUtils';

interface CalendarMonthViewProps {
  posts: PostActivityEntry[];
  currentDate: Date;
  onEditPost: (post: PostActivityEntry) => void;
}

export function CalendarMonthView({ posts, currentDate, onEditPost }: CalendarMonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.calendarGrid}>
      {weekdays.map((day) => (
        <div key={day} className={styles.weekdayHeader}>{day}</div>
      ))}
      {calendarDays.map((day) => {
        const dayPosts = posts.filter((post) => {
          const date = post.scheduledAt ? new Date(post.scheduledAt) : new Date(post.createdAt);
          return isSameDay(date, day);
        });

        return (
          <div 
            key={day.toString()} 
            className={`${styles.dayCell} ${!isSameMonth(day, monthStart) ? styles.notCurrentMonth : ''} ${isToday(day) ? styles.today : ''}`}
          >
            <div className={styles.dayNumber}>{format(day, 'd')}</div>
            <div className={styles.postsContainer}>
              {dayPosts.map((post) => (
                <Tooltip key={post.id} title={`${post.title}${post.isPublished ? ' (Published)' : ' (Scheduled)'}`} arrow>
                  <div 
                    className={`${styles.calendarPost} ${getPlatformClass(post.platforms)} ${post.isPublished ? styles.publishedPost : ''}`}
                    onClick={() => onEditPost(post)}
                  >
                    {post.isPublished && '✅ '}{post.title}
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
