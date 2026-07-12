import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import styles from '@/app/(dashboard)/schedule/schedule.module.css';
import { PostActivityEntry } from '@/app/(dashboard)/schedule/types';
import { PLATFORM_ICONS } from '@/app/(dashboard)/schedule/constants';

export interface ScheduleTimelineViewProps {
  posts: PostActivityEntry[];
  targetId: string | null;
  onPublishNow: (id: string) => void;
  onEdit: (post: PostActivityEntry) => void;
  onDelete: (id: string) => void;
}

export function ScheduleTimelineView({
  posts,
  targetId,
  onPublishNow,
  onEdit,
  onDelete
}: ScheduleTimelineViewProps) {
  return (
    <div className={styles.timeline}>
      {posts.map((post) => (
        <div 
          key={post.id} 
          id={`post-${post.id}`}
          className={`${styles.postCard} ${targetId === post.id ? styles.highlightedPost : ''}`}
          data-testid={`schedule-post-${post.id}`}
        >
          <div className={styles.timelineDot} />
          <GlassCard className={styles.cardInner}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                {post.description && (
                  <p className={styles.postDescription}>{post.description}</p>
                )}
              </div>
              <div className={styles.metaBadges}>
                <span className={`${styles.formatBadge} ${post.videoFormat === 'short' ? styles.formatShort : styles.formatLong}`}>
                  {post.videoFormat === 'short' ? '⚡ Short' : '🎬 Long'}
                </span>
                <span className={styles.timestamp} suppressHydrationWarning>
                  {new Date(post.scheduledAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className={styles.platformRow}>
              {post.platforms.map(p => (
                <span key={post.id + p.platform} className={styles.platformPill}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {PLATFORM_ICONS[p.platform] || <InfoIcon sx={{ fontSize: 16 }} />}
                    {p.platform}
                  </span>
                </span>
              ))}
            </div>

            <div className={styles.actionRow}>
              <button 
                className={`${styles.actionButton} ${styles.primaryAction}`}
                onClick={() => onPublishNow(post.id)}
              >
                <RocketLaunchIcon sx={{ fontSize: 18 }} /> Publish Now
              </button>
              <button 
                className={`${styles.actionButton} ${styles.secondaryAction}`}
                onClick={() => onEdit(post)}
              >
                <EditIcon sx={{ fontSize: 18 }} /> Edit
              </button>
              <button 
                className={`${styles.actionButton} ${styles.dangerAction}`}
                onClick={() => onDelete(post.id)}
              >
                <DeleteIcon sx={{ fontSize: 18 }} /> Cancel
              </button>
            </div>
          </GlassCard>
        </div>
      ))}
    </div>
  );
}
