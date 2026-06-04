import React from 'react';
import styles from './LoginComponents.module.css';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InstagramIcon from '@mui/icons-material/Instagram';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export function DashboardMockup() {
  return (
    <div className={styles.mockupContainer}>
      <div className={styles.mockupHeader}>
        <div className={styles.mockupDots}>
          <span style={{ background: '#ff5f56' }} />
          <span style={{ background: '#ffbd2e' }} />
          <span style={{ background: '#27c93f' }} />
        </div>
        <div className={styles.mockupAddress}>socialstudio.ai/activity</div>
      </div>
      
      <div className={styles.mockupBody}>
        <div className={styles.mockupSidebar} />
        <div className={styles.mockupContent}>
          <div className={styles.mockupActivityCard}>
            <div className={styles.mockupCardTop}>
              <div className={styles.mockupAvatar} />
              <div className={styles.mockupMetadata}>
                <div className={styles.mockupTitleLine} />
                <div className={styles.mockupDateLine} />
              </div>
              <div className={styles.liveBadge}>
                <span className={styles.pulseDot} />
                LIVE
              </div>
            </div>
            
            <div className={styles.mockupStatsGrid}>
              <div className={styles.mockupStatItem}>
                <YouTubeIcon sx={{ fontSize: 16, color: '#FF0000' }} />
                <div className={styles.mockupStatBar} style={{ width: '60%' }} />
                <CheckCircleIcon sx={{ fontSize: 14, color: '#27c93f', marginLeft: 'auto' }} />
              </div>
              <div className={styles.mockupStatItem}>
                <MusicNoteIcon sx={{ fontSize: 16, color: '#00F2EA' }} />
                <div className={styles.mockupStatBar} style={{ width: '85%' }} />
                <CheckCircleIcon sx={{ fontSize: 14, color: '#27c93f', marginLeft: 'auto' }} />
              </div>
              <div className={styles.mockupStatItem}>
                <InstagramIcon sx={{ fontSize: 16, color: '#E1306C' }} />
                <div className={styles.mockupStatBar} style={{ width: '45%' }} />
                <CheckCircleIcon sx={{ fontSize: 14, color: '#27c93f', marginLeft: 'auto' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
