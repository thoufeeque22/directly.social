'use client';

import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import styles from './calendar.module.css';
import { PostActivityEntry } from '@/app/(dashboard)/schedule/types';
import { getPlatformClass } from './calendarUtils';

interface CalendarWeekViewProps {
  posts: PostActivityEntry[];
  currentDate: Date;
  onEditPost: (post: PostActivityEntry) => void;
}

export function CalendarWeekView({ posts, currentDate, onEditPost }: CalendarWeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(weekStart);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className={styles.weeklyGrid}>
      {days.map((day) => {
        const dayPosts = posts.filter((post) => {
          const date = post.scheduledAt ? new Date(post.scheduledAt) : new Date(post.createdAt);
          return isSameDay(date, day);
        });

        return (
          <div key={day.toString()} className={styles.weeklyDayRow}>
            <div className={styles.weeklyDayInfo}>
              <div className={styles.weeklyDayName}>{format(day, 'EEE')}</div>
              <div className={styles.weeklyDayNumber}>{format(day, 'd')}</div>
            </div>
            <div className={styles.weeklyPosts}>
              {dayPosts.length === 0 ? (
                <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem', opacity: 0.5 }}>
                  No posts scheduled
                </div>
              ) : (
                dayPosts.map((post) => {
                  const date = post.scheduledAt ? new Date(post.scheduledAt) : new Date(post.createdAt);
                  return (
                    <div 
                      key={post.id} 
                      className={`${styles.calendarPost} ${post.isPublished ? styles.publishedPost : ''} ${getPlatformClass(post.platforms)}`}
                      style={{ padding: '0.75rem', fontSize: '0.85rem' }}
                      onClick={() => onEditPost(post)}
                    >
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                        {post.isPublished && '✅ '}{post.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        {format(date, 'h:mm a')} • {post.videoFormat === 'short' ? '⚡ Short' : '🎬 Long'}
                        {post.isPublished ? ' • Published' : ' • Scheduled'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
