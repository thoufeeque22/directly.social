/* eslint-disable max-lines */
"use client";

import React, { useState, useEffect } from 'react';
import { signIn } from "next-auth/react";
import styles from './Login.module.css';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { useSearchParams } from 'next/navigation';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';

type AuthProvider = 'google' | 'facebook' | 'tiktok';

export function LoginContent() {
  const [showWarning, setShowWarning] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<AuthProvider | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const provider = searchParams.get('provider');
    const isBridge = searchParams.get('bridge') === 'true';

    if (isBridge && provider) {
      console.log(`[Auth] Bridge triggered for ${provider}`);
      signIn(provider, { callbackUrl: '/auth/success' });
    }
  }, [searchParams]);

  const startNativeLogin = async (provider: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://directly.social';
    const bridgeUrl = `${baseUrl}/login?bridge=true&provider=${provider}&native=true`;

    console.log(`[Auth] Opening native bridge for ${provider}:`, bridgeUrl);

    try {
      await Browser.open({ url: bridgeUrl });
    } catch (error) {
      console.error("[Auth] Failed to open native browser:", error);
      signIn(provider, { callbackUrl: '/auth/success' });
    }
  };

  const handleLoginClick = async (provider: AuthProvider) => {
    const isNative = typeof window !== 'undefined' && 
                     Capacitor.getPlatform() !== 'web' &&
                     (Capacitor.isNativePlatform() || navigator.userAgent.includes('DirectlyApp'));

    if (isNative) {
      await startNativeLogin(provider);
      return;
    }

    if (provider === 'google') {
      signIn('google', { callbackUrl: '/' });
      return;
    }

    setPendingProvider(provider);
    setShowWarning(true);
  };

  const confirmLogin = () => {
    if (pendingProvider) {
      signIn(pendingProvider, { callbackUrl: '/' });
    }
    setShowWarning(false);
  };

  const handleE2ELogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const result = await signIn('credentials', { 
      email, 
      password, 
      redirect: false 
    });

    if (result?.error) {
      console.error("[E2E] Login failed:", result.error);
    } else {
      window.location.href = '/';
    }
  };

  if (searchParams.get('bridge') === 'true') {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
        <div className={styles.loadingWrapper}>
          <div className={styles.logo}>
            <AutoAwesomeIcon sx={{ fontSize: 40, color: 'hsl(var(--primary))' }} />
          </div>
          <h2 className={styles.title}>Connecting to {searchParams.get('provider')}...</h2>
          <p className={styles.subtitle}>Please wait while we secure your session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {showWarning && (
        <div className={styles.overlay} onClick={() => setShowWarning(false)}>
          <div className={styles.warningModal} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowWarning(false)}
            >
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
              <button 
                className={styles.primaryAction}
                onClick={async () => {
                  const isNative = typeof window !== 'undefined' && 
                                   Capacitor.getPlatform() !== 'web' &&
                                   (Capacitor.isNativePlatform() || navigator.userAgent.includes('DirectlyApp'));
                  setShowWarning(false);
                  if (isNative) {
                    await startNativeLogin('google');
                  } else {
                    signIn('google', { callbackUrl: '/' });
                  }
                }}
              >
                Back to Google (Recommended)
              </button>
              <button 
                className={styles.secondaryAction}
                onClick={confirmLogin}
              >
                Continue with {pendingProvider} anyway
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.loginCard} style={{ margin: '0 auto' }}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <AutoAwesomeIcon sx={{ fontSize: 48, color: 'hsl(var(--primary))' }} />
          </div>
          <h1 className={styles.title}>directly.social</h1>
          <p className={styles.subtitle}>Sign in to manage your automated distribution.</p>
        </div>

        <div className={styles.buttonGroup}>
          <button 
            onClick={() => handleLoginClick("google")}
            className={`${styles.loginBtn} ${styles.googleBtn}`}
          >
            <span className={styles.btnIcon}>G</span>
            Continue with Google
          </button>

          <button 
            onClick={() => handleLoginClick("facebook")}
            className={`${styles.loginBtn} ${styles.facebookBtn}`}
          >
            <span className={styles.btnIcon}>f</span>
            Continue with Facebook
          </button>

          <button 
            onClick={() => handleLoginClick("tiktok")}
            className={`${styles.loginBtn} ${styles.tiktokBtn}`}
          >
            <span className={styles.btnIcon}>d</span>
            Continue with TikTok
          </button>
        </div>

        {process.env.NEXT_PUBLIC_E2E === 'true' && (
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid hsla(var(--border)/0.5)' }}>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem', letterSpacing: '0.05em' }}>E2E Test Login</h3>
            <form onSubmit={handleE2ELogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Test Email" 
                  defaultValue="tester@directly.social"
                  required
                  data-testid="e2e-email-input"
                  style={{ background: 'hsla(var(--muted)/0.3)', border: '1px solid hsla(var(--border)/0.5)', padding: '0.75rem', borderRadius: '0.5rem', color: 'hsl(var(--foreground))' }}
                />
                <input 
                  name="password" 
                  type="password" 
                  placeholder="Test Password" 
                  required
                  data-testid="e2e-password-input"
                  style={{ background: 'hsla(var(--muted)/0.3)', border: '1px solid hsla(var(--border)/0.5)', padding: '0.75rem', borderRadius: '0.5rem', color: 'hsl(var(--foreground))' }}
                />
                <button 
                  type="submit"
                  data-testid="e2e-login-submit"
                  style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Authenticate Tester
                </button>
            </form>
          </div>
        )}

        <div className={styles.footer}>
          By continuing, you agree to our 
          <br />
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
