"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from './client';
import type { Session } from '@/auth';

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children, session: initialSession }: { children: React.ReactNode, session?: Session | null }) {
  const [session, setSession] = useState<Session | null>(initialSession || null);
  const supabase = createClient();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E === 'true' && document.cookie.includes('e2e-bypass=true')) {
      setSession({
        user: {
          id: "e2e-test-user-id",
          name: "Test User",
          email: "tester@directly.social",
        }
      });
      return;
    }

    supabase.auth.getSession().then(({ data: { session: sbSession } }) => {
      if (sbSession?.user) {
        setSession({
          user: {
            id: sbSession.user.id,
            name: sbSession.user.user_metadata?.name || sbSession.user.email?.split('@')[0] || 'User',
            email: sbSession.user.email,
          }
        });
      } else {
        setSession(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sbSession) => {
      if (sbSession?.user) {
        setSession({
          user: {
            id: sbSession.user.id,
            name: sbSession.user.user_metadata?.name || sbSession.user.email?.split('@')[0] || 'User',
            email: sbSession.user.email,
          }
        });
      } else {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const session = useContext(SessionContext);
  return {
    data: session,
    status: session ? "authenticated" : "unauthenticated",
    update: async (data?: unknown) => { 
      // mock 
      void data;
    },
  };
}

export async function signIn(provider: string, options?: Record<string, unknown>): Promise<{ ok: boolean, error: string | null, status: number }> {
  const supabase = createClient();
  if (provider === 'google') {
    const callbackUrl = typeof options?.callbackUrl === 'string' ? options.callbackUrl : undefined;
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callbackUrl } });
  } else if (provider === 'credentials') {
    if (process.env.NEXT_PUBLIC_E2E === 'true') {
      document.cookie = "e2e-bypass=true; path=/";
      return { ok: true, error: null, status: 200 };
    } else {
      const email = typeof options?.email === 'string' ? options.email : '';
      const password = typeof options?.password === 'string' ? options.password : '';
      if (email && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { ok: false, error: error.message, status: 401 };
        }
      }
      return { ok: true, error: null, status: 200 };
    }
  } else {
    console.warn(`signIn called with unsupported provider: ${provider}`);
  }
  return { ok: true, error: null, status: 200 };
}

export async function signOut(options?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_E2E === 'true') {
    document.cookie = "e2e-bypass=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } else {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
  
  if (options?.callbackUrl && typeof options.callbackUrl === 'string') {
    window.location.href = options.callbackUrl;
  } else {
    window.location.href = '/login';
  }
}
