import React from 'react';
import StopIcon from '@mui/icons-material/Stop';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ActivityIcon from '@mui/icons-material/History';
import { PostActivityEntry } from '@/hooks/useActivity';
import { formatRelativeDate } from '@/lib/utils/date';
import styles from '@/app/(dashboard)/activity/activity.module.css';

// TODO: Refactor: logic extraction needed
interface ActivityCardActionsProps {
  post: PostActivityEntry;
  isCardActive: boolean;
  isActiveStaging: boolean;
  activeResumingId: string | null;
  onCancelAll: (e: React.MouseEvent, activityId: string) => void;
  onInPlaceResume: (post: PostActivityEntry) => void;
  now: number;
}

export function ActivityCardActions({
  post,
  isCardActive,
  isActiveStaging,
  activeResumingId,
  onCancelAll,
  onInPlaceResume,
  now
}: ActivityCardActionsProps) {
  const postCreatedAt = new Date(post.createdAt).getTime();
  const isPostStale = post.platforms.some(p => p.status === 'pending') && 
                      (now - postCreatedAt > 60 * 1000) && 
                      !post.stagedFileId;

  return (
    <div className={styles.metaBadges}>
      <span className={`${styles.formatBadge} ${post.videoFormat === 'short' ? styles.formatShort : styles.formatLong}`}>
        {post.videoFormat === 'short' ? ' Short' : ' Long'}
      </span>
      <span className={styles.timestamp}>
        {formatRelativeDate(post.createdAt)}
      </span>
      
      {isCardActive && (
        <button 
          className={styles.stopAllButton}
          onClick={(e) => onCancelAll(e, post.id)}
          title="Stop All active distributions for this post"
        >
          <StopIcon sx={{ fontSize: 16 }} /> STOP ALL
        </button>
      )}

      {isPostStale && !isActiveStaging && (
        <button 
          className={styles.resumeButton}
          onClick={() => onInPlaceResume(post)}
          disabled={activeResumingId === post.id}
          style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {activeResumingId === post.id ? 
            <ActivityIcon className="animate-pulse" sx={{ fontSize: 16 }} /> : 
            <RocketLaunchIcon sx={{ fontSize: 16 }} />
          }
          {activeResumingId === post.id ? 'Processing' : 'Manual Resume'}
        </button>
      )}
    </div>
  );
}
