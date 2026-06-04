import React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import styles from './LoginComponents.module.css';

export function FeaturesSection() {
  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 32, color: 'hsl(var(--primary))' }} />,
      title: 'AI Content Generation',
      desc: 'Smart titles, descriptions, and hashtags tailored for each platform.'
    },
    {
      icon: <BarChartIcon sx={{ fontSize: 32, color: 'hsl(var(--primary))' }} />,
      title: 'Unified Analytics',
      desc: 'Track performance across all your accounts in one single view.'
    },
    {
      icon: <StorageIcon sx={{ fontSize: 32, color: 'hsl(var(--primary))' }} />,
      title: 'Bring Your Own Storage',
      desc: 'Full control over your media using your own S3 or R2 buckets.'
    }
  ];

  return (
    <section id="features" className={styles.featuresSection}>
      <div className={styles.featuresGrid}>
        {features.map((f, i) => (
          <div key={i} className={styles.featureCard}>
            <div className={styles.featureIcon}>{f.icon}</div>
            <h3 className={styles.featureCardTitle}>{f.title}</h3>
            <p className={styles.featureCardDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
