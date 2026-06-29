"use client";

import React, { useState, useEffect } from 'react';
import { signIn } from "next-auth/react";
import styles from './Login.module.css';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { useSearchParams } from 'next/navigation';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FacebookIcon from '@mui/icons-material/Facebook';
import { NativeBridgeOverlay } from './NativeBridgeOverlay';
import { UnifiedIdentityModal } from './UnifiedIdentityModal';
import { E2ELoginForm } from './E2ELoginForm';
import { BRAND } from '@/lib/core/brand';
import { APP_CONFIG } from '@/lib/core/config';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';
import { TiktokIcon } from '@/components/ui/icons/TiktokIcon';

type AuthProvider = 'google' | 'facebook' | 'tiktok';

export function LoginContent() {
  const [showWarning, setShowWarning] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<AuthProvider | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const provider = searchParams.get('provider');
    if (searchParams.get('bridge') === 'true' && provider) {
      signIn(provider, { callbackUrl: '/auth/success' });
    }
  }, [searchParams]);

  const handleLoginClick = async (provider: AuthProvider) => {
    const isNative = typeof window !== 'undefined' && 
                     Capacitor.getPlatform() !== 'web' &&
                     (Capacitor.isNativePlatform() || navigator.userAgent.includes(APP_CONFIG.userAgent));

    const callbackUrl = searchParams.get('callbackUrl') || '/';

    if (isNative) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : APP_CONFIG.urls.production;
      const bridgeUrl = `${baseUrl}/login?bridge=true&provider=${provider}&native=true`;
      try { await Browser.open({ url: bridgeUrl }); } catch { signIn(provider, { callbackUrl: '/auth/success' }); }
      return;
    }

    if (provider === 'google') { signIn('google', { callbackUrl }); return; }
    setPendingProvider(provider); setShowWarning(true);
  };

  const handleE2ELogin = async (_prevState: string | null, formData: FormData): Promise<string | null> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Step 1: Get CSRF token
      const csrfRes = await fetch('/api/auth/csrf');
      if (!csrfRes.ok) return `CSRF fetch failed: ${csrfRes.status}`;
      const { csrfToken } = await csrfRes.json() as { csrfToken: string };
      console.log('[E2E] Got CSRF token, attempting login for:', email);

      // Step 2: POST credentials directly with redirect:'manual' so fetch never
      // follows the 302 to NEXTAUTH_URL (which may be a tunnel/production URL).
      // NextAuth sets the session cookie on the 302 response itself, so we capture
      // it here and then manually navigate.
      const body = new URLSearchParams({ email, password, csrfToken, callbackUrl: '/' });
      const res = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        redirect: 'manual',
      });

      console.log('[E2E] Auth response status:', res.status);

      // status 0 = opaque redirect (fetch manual), 302 = standard redirect — both mean success
      if (res.status === 0 || res.status === 302 || res.status === 200) {
        console.log('[E2E] Login success — navigating to /');
        window.location.href = '/';
        return null;
      }

      const body2 = await res.text().catch(() => '');
      return `Auth failed: HTTP ${res.status} — ${body2.slice(0, 120)}`;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[E2E] Exception:', message);
      return `Error: ${message}`;
    }
  };


  if (searchParams.get('bridge') === 'true') return <NativeBridgeOverlay provider={searchParams.get('provider')} />;

  return (
    <div className={styles.container} style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {showWarning && (
        <UnifiedIdentityModal 
          pendingProvider={pendingProvider} 
          onClose={() => setShowWarning(false)}
          onContinue={() => { if (pendingProvider) signIn(pendingProvider, { callbackUrl: searchParams.get('callbackUrl') || '/' }); setShowWarning(false); }}
          onRecommended={async () => {
            const isNative = typeof window !== 'undefined' && Capacitor.getPlatform() !== 'web' && (Capacitor.isNativePlatform() || navigator.userAgent.includes(APP_CONFIG.userAgent));
            setShowWarning(false);
            if (isNative) { const baseUrl = typeof window !== 'undefined' ? window.location.origin : APP_CONFIG.urls.production; await Browser.open({ url: `${baseUrl}/login?bridge=true&provider=google&native=true` }); }
            else { signIn('google', { callbackUrl: searchParams.get('callbackUrl') || '/' }); }
          }}
        />
      )}
      <div className={styles.loginCard} style={{ margin: '0 auto' }}>
        <div className={styles.header}>
          <div className={styles.logo}><AutoAwesomeIcon sx={{ fontSize: 48, color: 'hsl(var(--primary))' }} /></div>
          <h1 className={styles.title}>{BRAND.name}</h1>
          <p className={styles.subtitle}>Sign in to manage your automated distribution.</p>
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={() => handleLoginClick("google")} className={`${styles.loginBtn} ${styles.googleBtn}`}><span className={styles.btnIcon}><GoogleIcon /></span>Continue with Google</button>
          <button onClick={() => handleLoginClick("facebook")} className={`${styles.loginBtn} ${styles.facebookBtn}`}><span className={styles.btnIcon}><FacebookIcon /></span>Continue with Facebook</button>
          <button onClick={() => handleLoginClick("tiktok")} className={`${styles.loginBtn} ${styles.tiktokBtn}`}><span className={styles.btnIcon}><TiktokIcon /></span>Continue with TikTok</button>
        </div>
        {process.env.NEXT_PUBLIC_E2E === 'true' && <E2ELoginForm action={handleE2ELogin} />}
        <div className={styles.footer}>By continuing, you agree to our <br /> <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></div>
      </div>
    </div>
  );
}
