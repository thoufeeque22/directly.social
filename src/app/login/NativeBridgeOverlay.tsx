'use client';

import React from 'react';
import styles from './Login.module.css';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface NativeBridgeOverlayProps {
  provider: string | null;
}

export function NativeBridgeOverlay({ provider }: NativeBridgeOverlayProps) {
  return (
    <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
      <div className={styles.loadingWrapper}>
        <div className={styles.logo}>
          <AutoAwesomeIcon sx={{ fontSize: 40, color: 'hsl(var(--primary))' }} />
        </div>
        <h2 className={styles.title}>Connecting to {provider}...</h2>
        <p className={styles.subtitle}>Please wait while we secure your session.</p>
      </div>
    </div>
  );
}
