"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from './client';
import type { Session } from '@/auth';

export { signIn, signOut } from './auth-actions';

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children, session: initialSession }: { children: React.ReactNode, session?: Session | null }) {
  const [session, setSession] = useState<Session | null>(initialSession || null);
  const supabase = createClient();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E === 'true' && document.cookie.includes('e2e-bypass=true')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
