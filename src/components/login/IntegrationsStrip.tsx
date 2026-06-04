import React from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import styles from './LoginComponents.module.css';

export function IntegrationsStrip() {
  const platforms = [
    { icon: <YouTubeIcon sx={{ fontSize: 24, color: '#FF0000' }} />, label: 'YouTube' },
    { icon: <MusicNoteIcon sx={{ fontSize: 24, color: 'hsl(var(--foreground))' }} />, label: 'TikTok' },
    { icon: <InstagramIcon sx={{ fontSize: 24, color: '#E1306C' }} />, label: 'Instagram' },
    { icon: <FacebookIcon sx={{ fontSize: 24, color: '#1877F2' }} />, label: 'Facebook' },
  ];

  return (
    <section className={styles.techStackStrip}>
      <span className={styles.stripLabel}>Integrates seamlessly with</span>
      <div className={styles.stackWrapper}>
        {platforms.map((item, index) => (
          <div key={index} className={styles.stackItem}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
