import React, { useState } from 'react';
import styles from './Login.module.css';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';

interface LoginButtonsProps {
  onGoogleClick: () => void;
  onEmailSubmit: (email: string) => void;
}

export function LoginButtons({ onGoogleClick, onEmailSubmit }: LoginButtonsProps) {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onEmailSubmit(email);
    }
  };

  return (
    <div className={styles.buttonGroup}>
      <button onClick={onGoogleClick} className={`${styles.loginBtn} ${styles.googleBtn}`} style={{ marginBottom: '16px' }}>
        <span className={styles.btnIcon}><GoogleIcon /></span>Continue with Google
      </button>
      
      <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
        <span style={{ margin: '0 12px', color: '#666', fontSize: '14px' }}>or</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
      </div>

      <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address" 
          required
          style={{ 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: '1px solid #ccc',
            fontSize: '16px',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'center'
          }}
        />
        <button type="submit" className={styles.loginBtn} style={{ backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
          Continue with Email
        </button>
      </form>
    </div>
  );
}
