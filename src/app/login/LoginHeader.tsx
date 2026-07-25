import React from 'react';
import styles from './Login.module.css';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { BRAND } from '@/lib/core/brand';

export function LoginHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}><AutoAwesomeIcon sx={{ fontSize: 48, color: 'hsl(var(--primary))' }} /></div>
      <h1 className={styles.title}>{BRAND.name}</h1>
      <p className={styles.subtitle}>Sign in to manage your automated distribution.</p>
    </div>
  );
}
