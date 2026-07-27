import React from 'react';
import styles from './Login.module.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';
import { TiktokIcon } from '@/components/ui/icons/TiktokIcon';
import type { AuthProvider } from '@/lib/core/constants';

export function LoginButtons({ onLoginClick }: { onLoginClick: (provider: AuthProvider) => void }) {
  return (
    <div className={styles.buttonGroup}>
      <button onClick={() => onLoginClick("google")} className={`${styles.loginBtn} ${styles.googleBtn}`}>
        <span className={styles.btnIcon}><GoogleIcon /></span>Continue with Google
      </button>
      <button onClick={() => onLoginClick("facebook")} className={`${styles.loginBtn} ${styles.facebookBtn}`}>
        <span className={styles.btnIcon}><FacebookIcon /></span>Continue with Facebook
      </button>
      <button onClick={() => onLoginClick("tiktok")} className={`${styles.loginBtn} ${styles.tiktokBtn}`}>
        <span className={styles.btnIcon}><TiktokIcon /></span>Continue with TikTok
      </button>
      <button onClick={() => onLoginClick("linkedin")} className={`${styles.loginBtn} ${styles.linkedinBtn}`}>
        <span className={styles.btnIcon}><LinkedInIcon /></span>Continue with LinkedIn
      </button>
    </div>
  );
}
