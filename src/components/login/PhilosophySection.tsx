import React from 'react';
import styles from './LoginComponents.module.css';

export function PhilosophySection() {
  return (
    <section className={styles.philosophySection}>
      <div className={styles.philosophyContent}>
        <h2 className={styles.philosophyTitle}>Simplify your Social Workflow</h2>
        <p className={styles.philosophyText}>
          One dashboard for your entire social presence. 
          Post everywhere instantly without complex manual workflows or broken automations.
          Built for creators who value control and simplicity.
        </p>
      </div>
    </section>
  );
}
