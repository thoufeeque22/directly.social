"use client";

import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { useSearchParams, useRouter } from 'next/navigation';
import { APP_CONFIG } from '@/lib/core/config';
import Alert from '@mui/material/Alert';
import { NativeBridgeOverlay } from './NativeBridgeOverlay';
import { E2ELoginForm } from './E2ELoginForm';
import { LoginButtons } from './LoginButtons';
import { LoginHeader } from './LoginHeader';
import { getErrorMessage } from './getErrorMessage';
import { createClient } from '@/lib/supabase/client';

export function LoginContent({ referrerName }: { referrerName?: string | null }) {
  const searchParams = useSearchParams();
  const errorMessage = getErrorMessage(searchParams.get('error'));
  const supabase = createClient();
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      document.cookie = `referralCode=${ref}; path=/; max-age=${30 * 24 * 60 * 60}`;
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    const isNative = typeof window !== 'undefined' && 
                     Capacitor.getPlatform() !== 'web' &&
                     (Capacitor.isNativePlatform() || navigator.userAgent.includes(APP_CONFIG.userAgent));

    const callbackUrl = searchParams.get('callbackUrl') || '/login';
    const redirectUrl = `${window.location.origin}/auth/v1/callback?next=${callbackUrl}`;

    if (isNative) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : APP_CONFIG.urls.production;
      const bridgeUrl = `${baseUrl}/login?bridge=true&provider=google&native=true`;
      try { 
        await Browser.open({ url: bridgeUrl }); 
      } catch { 
        await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl } });
      }
      return;
    }

    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl } });
  };

  const handleEmailLogin = async (email: string) => {
    setEmailMsg(null);
    const callbackUrl = searchParams.get('callbackUrl') || '/login';
    const redirectUrl = `${window.location.origin}/auth/v1/callback?next=${callbackUrl}`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      setEmailMsg({ type: 'error', text: error.message });
    } else {
      setEmailMsg({ type: 'success', text: 'Check your email for the login link!' });
    }
  };

  if (searchParams.get('bridge') === 'true') return <NativeBridgeOverlay provider={searchParams.get('provider')} />;

  return (
    <div className={styles.container} style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        {emailMsg && (
          <Alert severity={emailMsg.type} sx={{ mb: 3, borderRadius: 2 }}>
            {emailMsg.text}
          </Alert>
        )}
        <LoginButtons 
          onGoogleClick={handleGoogleLogin} 
          onEmailSubmit={handleEmailLogin} 
        />
        {/* E2E Bypass Form */}
        {process.env.NEXT_PUBLIC_E2E === 'true' && <E2ELoginForm />}
        <div className={styles.footer}>By continuing, you agree to our <br /> <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></div>
      </div>
    </div>
  );
}
