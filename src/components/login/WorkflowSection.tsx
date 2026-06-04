import React from 'react';
import styles from './LoginComponents.module.css';
import StorageIcon from '@mui/icons-material/Storage';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export function WorkflowSection() {
  const steps = [
    {
      icon: <StorageIcon sx={{ fontSize: 32 }} />,
      title: 'Connect Your Vault',
      desc: 'Link your YouTube, TikTok, and Meta accounts using secure OAuth2.'
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
      title: 'Compose & Enhance',
      desc: 'Upload once. Let AI tailor your metadata for every platform.'
    },
    {
      icon: <RocketLaunchIcon sx={{ fontSize: 32 }} />,
      title: 'Pulse to Publish',
      desc: 'One click to distribute instantly or schedule for peak engagement.'
    }
  ];

  return (
    <section className={styles.workflowSection}>
      <div className={styles.workflowGrid}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className={styles.workflowStep}>
              <div className={styles.workflowIconWrapper}>
                {step.icon}
                <div className={styles.stepNumber}>{index + 1}</div>
              </div>
              <h3 className={styles.workflowTitle}>{step.title}</h3>
              <p className={styles.workflowDesc}>{step.desc}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={styles.workflowConnector}>
                <ArrowForwardIcon />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
