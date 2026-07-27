"use client";

import React, { useState, useEffect } from 'react';
import { signIn } from "next-auth/react";
import styles from './Login.module.css';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { useSearchParams } from 'next/navigation';
import { APP_CONFIG } from '@/lib/core/config';
import Alert from '@mui/material/Alert';
import { NativeBridgeOverlay } from './NativeBridgeOverlay';
import { UnifiedIdentityModal } from './UnifiedIdentityModal';
import { E2ELoginForm } from './E2ELoginForm';
import { LoginButtons } from './LoginButtons';
import { LoginHeader } from './LoginHeader';
import { getErrorMessage } from './getErrorMessage';
import type { AuthProvider } from '@/lib/core/constants';

export function LoginContent({ referrerName }: { referrerName?: string | null }) {
  const [showWarning, setShowWarning] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<AuthProvider | null>(null);
  const searchParams = useSearchParams();
  const errorMessage = getErrorMessage(searchParams.get('error'));

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      document.cookie = `referralCode=${ref}; path=/; max-age=${30 * 24 * 60 * 60}`;
    }
  }, [searchParams]);

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

    const callbackUrl = searchParams.get('callbackUrl') || '/login';

    if (isNative) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : APP_CONFIG.urls.production;
      const bridgeUrl = `${baseUrl}/login?bridge=true&provider=${provider}&native=true`;
      try { await Browser.open({ url: bridgeUrl }); } catch { signIn(provider, { callbackUrl: '/auth/success' }); }
      return;
    }

    if (provider === 'google') { signIn('google', { callbackUrl }); return; }
    setPendingProvider(provider); setShowWarning(true);
  };



  if (searchParams.get('bridge') === 'true') return <NativeBridgeOverlay provider={searchParams.get('provider')} />;

  return (
    <div className={styles.container} style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {showWarning && (
        <UnifiedIdentityModal 
          pendingProvider={pendingProvider} 
          onClose={() => setShowWarning(false)}
          onContinue={() => { if (pendingProvider) signIn(pendingProvider, { callbackUrl: searchParams.get('callbackUrl') || '/login' }); setShowWarning(false); }}
          onRecommended={async () => {
            const isNative = typeof window !== 'undefined' && Capacitor.getPlatform() !== 'web' && (Capacitor.isNativePlatform() || navigator.userAgent.includes(APP_CONFIG.userAgent));
            setShowWarning(false);
            if (isNative) { const baseUrl = typeof window !== 'undefined' ? window.location.origin : APP_CONFIG.urls.production; await Browser.open({ url: `${baseUrl}/login?bridge=true&provider=google&native=true` }); }
            else { signIn('google', { callbackUrl: searchParams.get('callbackUrl') || '/login' }); }
          }}
        />
      )}
      <div className={styles.loginCard} style={{ margin: '0 auto' }}>
        <LoginHeader />
        {referrerName && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} data-testid="referral-banner">
            You&apos;ve been gifted 1 Free Month upon upgrading by {referrerName}!
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <LoginButtons onLoginClick={handleLoginClick} />
        {/* E2E Bypass Form */}
        {process.env.NEXT_PUBLIC_E2E === 'true' && <E2ELoginForm />}
        <div className={styles.footer}>By continuing, you agree to our <br /> <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></div>
      </div>
    </div>
  );
}
