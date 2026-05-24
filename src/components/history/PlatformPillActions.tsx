import React from 'react';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import styles from '@/app/history/history.module.css';
import { PlatformResult } from '@/hooks/useHistory';

interface PlatformPillActionsProps {
  p: PlatformResult;
  isFailed: boolean;
  isCancelled: boolean;
  isPending: boolean;
  isOptimistic: boolean;
  isPostStale: boolean;
  historyId: string;
  onRetry: (e: React.MouseEvent, p: PlatformResult) => void;
  onCancel: (e: React.MouseEvent, resultId: string, platform?: string, historyId?: string) => void;
}

export function PlatformPillActions({
  p, isFailed, isCancelled, isPending, isOptimistic, isPostStale, historyId, onRetry, onCancel
}: PlatformPillActionsProps) {
  return (
    <div className={styles.pillActions}>
      {isFailed && (
        <button className={styles.pillActionButton} onClick={(e) => onRetry(e, p)} title="Retry Upload">
          <RefreshIcon sx={{ fontSize: 14 }} />
        </button>
      )}
      {(isPending || isOptimistic) && !isCancelled && !isPostStale && (
        <button className={styles.pillActionButton} onClick={(e) => onCancel(e, p.id, p.platform, historyId)} title="Stop Platform Upload" aria-label="Stop Platform Upload">
          <StopIcon sx={{ fontSize: 14, color: 'error.main' }} />
        </button>
      )}
      {isCancelled && (
        <button className={styles.pillActionButton} onClick={(e) => onRetry(e, p)} title="Resume Stopped Upload">
          <PlayArrowIcon sx={{ fontSize: 14 }} />
        </button>
      )}
    </div>
  );
}
