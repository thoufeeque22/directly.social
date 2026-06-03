import React from 'react';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ActivityIcon from '@mui/icons-material/History';
import styles from '@/app/activity/activity.module.css';
import { PlatformResult, PostActivityEntry } from '@/hooks/useActivity';
import { getPlatformMeta } from './PlatformConstants';
import { PlatformPillActions } from './PlatformPillActions';

interface PlatformResultItemProps {
  p: PlatformResult;
  post: PostActivityEntry;
  cancelledIds: string[];
  processingIds: string[];
  onRetry: (e: React.MouseEvent, p: PlatformResult) => void;
  onCancel: (e: React.MouseEvent, resultId: string, platform?: string, activityId?: string) => void;
  now: number;
}

// TODO: Refactor: logic extraction needed
export function PlatformResultItem({ p, post, cancelledIds, processingIds, onRetry, onCancel, now }: PlatformResultItemProps) {
  const meta = getPlatformMeta(p.platform);
  const isFailed = p.status === 'failed';
  const isCancelled = p.status === 'cancelled' || cancelledIds.includes(p.id);
  const isRetrying = p.status === 'retrying' || processingIds.includes(p.id);
  const isUploading = p.status === 'uploading' && !isCancelled;
  const isPending = (p.status === 'pending' || p.status === 'processing') && !isCancelled;
  const isPostStale = p.status === 'pending' && (now - new Date(post.createdAt).getTime() > 60 * 1000) && !post.stagedFileId;
  const hasLink = !isFailed && !isRetrying && !isPending && !isUploading && !isCancelled && !isPostStale && p.permalink;

  const pillClasses = [
    styles.platformPill, meta.className,
    isFailed ? styles.platformPillFailed : isCancelled ? styles.platformPillCancelled :
    isRetrying ? styles.platformPillRetrying : isUploading ? styles.platformPillUploading :
    (isPending && !isPostStale) ? styles.platformPillPending : isPostStale ? styles.platformPillStale :
    hasLink ? styles.platformPillSuccess : styles.platformPillNoLink,
    isFailed ? styles.failedTooltip : '',
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {(isPending || isUploading) && !isPostStale && (
         <div 
           className={styles.pillProgressBar} 
           style={{ width: `${Math.max(p.progress, 0)}%` }} 
           data-testid={`progress-bar-${p.platform}`}
         />
      )}
      <span className={styles.pillIcon} style={{ display: 'flex', alignItems: 'center' }}>
        {isRetrying ? <RefreshIcon className="animate-spin" sx={{ fontSize: 16 }} /> : 
         isUploading ? <RocketLaunchIcon sx={{ fontSize: 16 }} /> : 
         (isPending && !isPostStale) ? <ActivityIcon className="animate-pulse" sx={{ fontSize: 16 }} /> : 
         isPostStale ? <ActivityIcon sx={{ fontSize: 16, opacity: 0.5 }} /> : 
         isCancelled ? <StopIcon sx={{ fontSize: 16 }} /> : meta.icon}
      </span>
      <span className={styles.pillLabel}>
        {isPostStale ? `${meta.label} (Waiting for Video)` : isCancelled ? `${meta.label} (Stopped)` : 
         (isPending && !isPostStale) ? (p.progress > 0 ? `${meta.label} (Distributing)` : `${meta.label} (In Queue)`) : 
         isUploading ? `${meta.label} (Uploading)` : meta.label}
        {(isPending || isUploading) && !isPostStale && p.progress > 0 && <span className={styles.progressPercent}>{Math.round(p.progress)}%</span>}
      </span>
      <PlatformPillActions p={p} isFailed={isFailed} isCancelled={isCancelled} isPending={isPending} 
        isOptimistic={!!post.isOptimistic} isPostStale={isPostStale} activityId={post.id} onRetry={onRetry} onCancel={onCancel} />
      {hasLink && <span className={styles.pillLink}><ArrowOutwardIcon sx={{ fontSize: 12 }} /></span>}
    </>
  );

  const tooltip = isFailed ? p.errorMessage || 'Upload failed' : isRetrying ? 'Retrying upload...' : 
                  (isPending && !isPostStale) ? 'Waiting for worker...' : isPostStale ? 'Waiting for video file...' : 
                  `Status: ${p.status}${p.progress > 0 ? ` (${p.progress}%)` : ''}`;

  return hasLink ? (
    <a href={p.permalink!} target="_blank" rel="noopener noreferrer" className={pillClasses} title={tooltip}>{content}</a>
  ) : (
    <span className={pillClasses} data-error={isFailed ? p.errorMessage || 'Upload failed' : undefined} title={tooltip}>{content}</span>
  );
}
