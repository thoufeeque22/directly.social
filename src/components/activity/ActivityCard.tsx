import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PreparationBar } from './PreparationBar';
import { ActivityCardHeader } from './ActivityCardHeader';
import { ActivityCardActions } from './ActivityCardActions';
import { ActivityPlatformList } from './ActivityPlatformList';
import { ActivityCardProps } from './types';
import StopIcon from '@mui/icons-material/Stop';
import styles from '@/app/activity/activity.module.css';

export function ActivityCard(props: ActivityCardProps) {
  const {
    post, cancelledIds, processingIds, activeResumingId, stagingStatus,
    onRetry, onCancelPlatform, onCancelAll, onInPlaceResume, now
  } = props;
  const isOptimistic = !!post.isOptimistic;
  const activePlatforms = post.platforms.filter(p => ['pending', 'uploading', 'processing', 'retrying'].includes(p.status) && !cancelledIds.includes(p.id));
  const isActive = activePlatforms.length > 0;
  const allPending = isActive && activePlatforms.every(p => p.status === 'pending');
  const isPostCancelled = post.platforms.every(p => p.status === 'cancelled' || cancelledIds.includes(p.id));
  const isActiveStaging = !!(stagingStatus.active && stagingStatus.activityId === post.id && !isPostCancelled);
  const isCardActive = !!((isActive || isActiveStaging || isOptimistic) && !isPostCancelled);

  return (
    <div data-testid={`activity-post-${post.id}`} className={`${styles.postCard} ${isCardActive ? styles.activePost : ''}`}>
      <div className={styles.timelineDot} />
      <GlassCard className={styles.cardInner} style={{ position: 'relative', overflow: 'hidden', opacity: isOptimistic ? 0.7 : 1 }}>
        <PreparationBar isActiveStaging={isActiveStaging} isOptimistic={isOptimistic} isCardActive={isCardActive} allPending={allPending} stagingStatus={stagingStatus} />
        <div className={styles.cardHeader} style={((allPending || isOptimistic) && isCardActive) || isActiveStaging ? { paddingTop: '1.75rem' } : {}}>
          <ActivityCardHeader title={post.title} description={post.description} isCardActive={isCardActive} isOptimistic={isOptimistic} isPostCancelled={isPostCancelled} platforms={post.platforms} />
          {!isOptimistic ? (
            <ActivityCardActions post={post} isCardActive={isCardActive} isActiveStaging={isActiveStaging} activeResumingId={activeResumingId} onCancelAll={onCancelAll} onInPlaceResume={onInPlaceResume} now={now} />
          ) : isCardActive && (
            <div className={styles.metaBadges}>
              <button className={styles.stopAllButton} onClick={(e) => onCancelAll(e, post.id)}><StopIcon sx={{ fontSize: 16 }} /> STOP ALL</button>
            </div>
          )}
        </div>
        <ActivityPlatformList post={post} cancelledIds={cancelledIds} processingIds={processingIds} onRetry={onRetry} onCancel={onCancelPlatform} now={now} />
      </GlassCard>
    </div>
  );
}
