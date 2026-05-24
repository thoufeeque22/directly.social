import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PreparationBar } from './PreparationBar';
import { HistoryCardHeader } from './HistoryCardHeader';
import { HistoryCardActions } from './HistoryCardActions';
import { HistoryPlatformList } from './HistoryPlatformList';
import { HistoryCardProps } from './types';
import StopIcon from '@mui/icons-material/Stop';
import styles from '@/app/history/history.module.css';

export function HistoryCard({
  post, cancelledIds, processingIds, activeResumingId, stagingStatus,
  onRetry, onCancelPlatform, onCancelAll, onInPlaceResume
}: HistoryCardProps) {
  const isOptimistic = !!post.isOptimistic;
  const activePlatforms = post.platforms.filter(p => ['pending', 'uploading', 'processing', 'retrying'].includes(p.status) && !cancelledIds.includes(p.id));
  const isActive = activePlatforms.length > 0;
  const allPending = isActive && activePlatforms.every(p => p.status === 'pending');
  const isPostCancelled = post.platforms.every(p => p.status === 'cancelled' || cancelledIds.includes(p.id));
  const isActiveStaging = !!(stagingStatus.active && stagingStatus.historyId === post.id && !isPostCancelled);
  const isCardActive = !!((isActive || isActiveStaging || isOptimistic) && !isPostCancelled);

  return (
    <div data-testid={`history-post-${post.id}`} className={`${styles.postCard} ${isCardActive ? styles.activePost : ''}`}>
      <div className={styles.timelineDot} />
      <GlassCard className={styles.cardInner} style={{ position: 'relative', overflow: 'hidden', opacity: isOptimistic ? 0.7 : 1 }}>
        <PreparationBar isActiveStaging={isActiveStaging} isOptimistic={isOptimistic} isCardActive={isCardActive} allPending={allPending} stagingStatus={stagingStatus} />
        <div className={styles.cardHeader} style={((allPending || isOptimistic) && isCardActive) || isActiveStaging ? { paddingTop: '1.75rem' } : {}}>
          <HistoryCardHeader title={post.title} description={post.description} isCardActive={isCardActive} isOptimistic={isOptimistic} isPostCancelled={isPostCancelled} />
          {!isOptimistic ? (
            <HistoryCardActions post={post} isCardActive={isCardActive} isActiveStaging={isActiveStaging} activeResumingId={activeResumingId} onCancelAll={onCancelAll} onInPlaceResume={onInPlaceResume} />
          ) : isCardActive && (
            <div className={styles.metaBadges}>
              <button className={styles.stopAllButton} onClick={(e) => onCancelAll(e, post.id)}><StopIcon sx={{ fontSize: 16 }} /> STOP ALL</button>
            </div>
          )}
        </div>
        <HistoryPlatformList post={post} cancelledIds={cancelledIds} processingIds={processingIds} onRetry={onRetry} onCancel={onCancelPlatform} />
      </GlassCard>
    </div>
  );
}
