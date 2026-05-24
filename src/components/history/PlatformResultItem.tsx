import React from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ComputerIcon from '@mui/icons-material/Computer';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HistoryIcon from '@mui/icons-material/History';
import styles from '@/app/history/history.module.css';
import { PlatformResult, PostHistoryEntry } from '@/hooks/useHistory';

const PLATFORM_META: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
  youtube:   { icon: <YouTubeIcon sx={{ fontSize: 18, color: '#FF0000' }} />, label: 'YouTube',   className: styles.platformYoutube },
  instagram: { icon: <InstagramIcon sx={{ fontSize: 18, color: '#E4405F' }} />, label: 'Instagram', className: styles.platformInstagram },
  facebook:  { icon: <FacebookIcon sx={{ fontSize: 18, color: '#1877F2' }} />, label: 'Facebook',  className: styles.platformFacebook },
  tiktok:    { icon: <MusicNoteIcon sx={{ fontSize: 18, color: 'text.primary' }} />, label: 'TikTok',    className: styles.platformTiktok },
  local:     { icon: <ComputerIcon sx={{ fontSize: 18, color: 'text.secondary' }} />, label: 'Local Dev',  className: styles.platformLocal },
};

interface PlatformResultItemProps {
  p: PlatformResult;
  post: PostHistoryEntry;
  cancelledIds: string[];
  processingIds: string[];
  onRetry: (e: React.MouseEvent, p: PlatformResult) => void;
  onCancel: (e: React.MouseEvent, resultId: string, platform?: string, historyId?: string) => void;
}

export function PlatformResultItem({ p, post, cancelledIds, processingIds, onRetry, onCancel }: PlatformResultItemProps) {
  const resolvedPlatform = p.platform.toLowerCase();
  const isOptimistic = post.isOptimistic;
  
  const basePlatform = resolvedPlatform.startsWith('local') ? 'local' : 
                      (resolvedPlatform === 'google' ? 'youtube' : resolvedPlatform);

  const meta = PLATFORM_META[basePlatform] || {
    icon: '',
    label: p.platform === 'unknown' ? 'Platform' : (p.platform.length > 15 ? 'External' : p.platform),
    className: styles.platformDefault,
  };

  const isFailed = p.status === 'failed';
  const isCancelled = p.status === 'cancelled' || cancelledIds.includes(p.id);
  const isRetrying = p.status === 'retrying' || processingIds.includes(p.id);
  const isUploading = p.status === 'uploading' && !isCancelled;
  const isPending = (p.status === 'pending' || p.status === 'processing') && !isCancelled;
  
  const postCreatedAt = new Date(post.createdAt).getTime();
  const isPostStale = p.status === 'pending' && (Date.now() - postCreatedAt > 60 * 1000) && !post.stagedFileId;
  const hasLink = !isFailed && !isRetrying && !isPending && !isUploading && !isCancelled && !isPostStale && p.permalink;

  const pillClasses = [
    styles.platformPill,
    meta.className,
    isFailed ? styles.platformPillFailed : 
    isCancelled ? styles.platformPillCancelled :
    isRetrying ? styles.platformPillRetrying : 
    isUploading ? styles.platformPillUploading :
    (isPending && !isPostStale) ? styles.platformPillPending :
    isPostStale ? styles.platformPillStale :
    hasLink ? styles.platformPillSuccess : styles.platformPillNoLink,
    isFailed ? styles.failedTooltip : '',
  ].filter(Boolean).join(' ');

  const isActiveStatus = (isPending || isUploading) && !isPostStale;
  const showProgressText = isActiveStatus && p.progress > 0;

  const content = (
    <>
      {isActiveStatus && (
         <div className={styles.pillProgressBar} style={{ width: `${Math.max(p.progress, 0)}%` }} data-testid={`progress-bar-${p.platform}`} />
      )}
      <span className={styles.pillIcon} style={{ display: 'flex', alignItems: 'center' }}>
        {isRetrying ? <RefreshIcon className="animate-spin" sx={{ fontSize: 16 }} /> : 
         isUploading ? <RocketLaunchIcon sx={{ fontSize: 16 }} /> : 
         (isPending && !isPostStale) ? <HistoryIcon className="animate-pulse" sx={{ fontSize: 16 }} /> : 
         isPostStale ? <HistoryIcon sx={{ fontSize: 16, opacity: 0.5 }} /> : 
         isCancelled ? <StopIcon sx={{ fontSize: 16 }} /> : 
         meta.icon}
      </span>
      <span className={styles.pillLabel}>
        {isPostStale ? `${meta.label} (Waiting for Video)` : 
         isCancelled ? `${meta.label} (Stopped)` : 
         (isPending && !isPostStale) ? (p.progress > 0 ? `${meta.label} (Distributing)` : `${meta.label} (In Queue)`) : 
         isUploading ? `${meta.label} (Uploading)` :
         meta.label}
        {showProgressText && <span className={styles.progressPercent}>{Math.round(p.progress)}%</span>}
      </span>
      
      <div className={styles.pillActions}>
        {isFailed && (
          <button className={styles.pillActionButton} onClick={(e) => onRetry(e, p)} title="Retry Upload">
            <RefreshIcon sx={{ fontSize: 14 }} />
          </button>
        )}
        {(isPending || isOptimistic) && !isCancelled && !isPostStale && (
          <button className={styles.pillActionButton} onClick={(e) => onCancel(e, p.id, p.platform, post.id)} title="Stop Platform Upload" aria-label="Stop Platform Upload">
            <StopIcon sx={{ fontSize: 14, color: 'error.main' }} />
          </button>
        )}
        {isCancelled && (
          <button className={styles.pillActionButton} onClick={(e) => onRetry(e, p)} title="Resume Stopped Upload">
            <PlayArrowIcon sx={{ fontSize: 14 }} />
          </button>
        )}
      </div>

      {hasLink && <span className={styles.pillLink}><ArrowOutwardIcon sx={{ fontSize: 12 }} /></span>}
    </>
  );

  if (hasLink) {
    return (
      <a key={p.id} href={p.permalink!} target="_blank" rel="noopener noreferrer" className={pillClasses} title={`View on ${meta.label}`}>
        {content}
      </a>
    );
  }

  const getTooltip = () => {
    if (isFailed) return p.errorMessage || 'Upload failed';
    if (isRetrying) return 'Retrying upload...';
    if (isPending && !isPostStale) return 'Waiting for worker...';
    if (isPostStale) return 'Waiting for video file...';
    return `Status: ${p.status}${p.progress > 0 ? ` (${p.progress}%)` : ''}`;
  };

  return (
    <span key={p.id} className={pillClasses} data-error={isFailed ? p.errorMessage || 'Upload failed' : undefined} title={getTooltip()}>
      {content}
    </span>
  );
}
