'use client';

import React from 'react';
import styles from './Login.module.css';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';

interface UnifiedIdentityModalProps {
  pendingProvider: string | null;
  onClose: () => void;
  onRecommended: () => void;
  onContinue: () => void;
}

export function UnifiedIdentityModal({ 
  pendingProvider, 
  onClose, 
  onRecommended, 
  onContinue 
}: UnifiedIdentityModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.warningModal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </button>
        <div className={styles.modalIcon}>
          <LockIcon sx={{ fontSize: 48, color: 'hsl(var(--primary))' }} />
        </div>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Unified Identity Check</h2>
          <p className={styles.modalText}>
            To keep all your social platforms in **one unified dashboard**, we recommend using your primary Google account. 
            <br /><br />
            Logging in with {pendingProvider} might create a separate, empty account if it uses a different email.
          </p>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.primaryAction} onClick={onRecommended}>
            Back to Google (Recommended)
          </button>
          <button className={styles.secondaryAction} onClick={onContinue}>
            Continue with {pendingProvider} anyway
          </button>
        </div>
      </div>
    </div>
  );
}
