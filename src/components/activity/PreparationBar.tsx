import React from 'react';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from '@/app/activity/activity.module.css';
import { UploadStatus } from '@/hooks/useUploadStatus';

interface PreparationBarProps {
  isActiveStaging: boolean;
  isOptimistic: boolean;
  isCardActive: boolean;
  allPending: boolean;
  stagingStatus: UploadStatus;
}

export function PreparationBar({
  isActiveStaging,
  isOptimistic,
  isCardActive,
  allPending,
  stagingStatus
}: PreparationBarProps) {
  if (isActiveStaging) {
    return (
      <div className={styles.globalPrepBar} data-testid="preparation-bar">
        <div 
          className={styles.globalPrepProgress} 
          data-testid="preparation-progress"
          style={{ width: `${stagingStatus.percent || 0}%`, transition: 'width 0.3s ease' }} 
        />
        <span className={styles.globalPrepText} data-testid="preparation-status">
          <RocketLaunchIcon className="animate-pulse" sx={{ fontSize: 16 }} /> {stagingStatus.status}
        </span>
      </div>
    );
  }

  if (isCardActive && (allPending || isOptimistic)) {
    return (
      <div className={styles.globalPrepBar} data-testid={isOptimistic ? "ghost-card-bar" : undefined}>
        <div className={styles.globalPrepProgress} />
        <span className={styles.globalPrepText}>
          <SettingsIcon className="animate-spin" sx={{ fontSize: 16 }} /> {isOptimistic ? 'Initializing...' : 'Preparing for distribution...'}
        </span>
      </div>
    );
  }

  return null;
}
