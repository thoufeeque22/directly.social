'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '@/theme';
import { updateThemePreference } from '@/app/actions/user/settings';
import { Theme } from '@prisma/client';
import { ColorMode, ThemeContext } from './ThemeContext';

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ColorMode>('system');
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('dark');
  useEffect(() => {
    const localPref = localStorage.getItem('theme-preference') as ColorMode;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localPref) setMode(localPref);
    
    if (process.env.NEXT_PUBLIC_E2E !== 'true') {
      (async () => {
        try {
          const { getThemePreference } = await import('@/app/actions/user/settings');
          const pref = await getThemePreference();
          const modePref = pref.toLowerCase() as ColorMode;
          // Only sync from server if the user is authenticated (i.e. the server
          // returned a real preference, not the catch-all SYSTEM fallback).
          // After sign-out the server action fails and falls back to SYSTEM,
          // which would overwrite the local preference and cause a theme flash.
          if (localPref && modePref === localPref) return; // already in sync
          if (modePref && modePref !== (localPref || mode)) {
            setMode(modePref);
            localStorage.setItem('theme-preference', modePref);
          }
        } catch {
          // Server action failed (e.g. no session after sign-out) — keep local pref
        }
      })();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      const isDark = mode === 'dark' || (mode === 'system' && mediaQuery.matches);
      setResolvedMode(isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('light-mode', !isDark);
    };
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [mode]);
  const value = useMemo(() => ({
    mode,
    setMode: (m: ColorMode) => {
      setMode(m);
      localStorage.setItem('theme-preference', m);
      if (process.env.NEXT_PUBLIC_E2E !== 'true') {
        const t = m === 'system' ? Theme.SYSTEM : m === 'dark' ? Theme.DARK : Theme.LIGHT;
        updateThemePreference(t).catch(() => {});
      }
    },
    toggleMode: () => {
      console.log('[Theme] Toggle clicked!');
      setMode((prevMode) => {
        const nextMode: ColorMode = prevMode === 'light' ? 'dark' : prevMode === 'dark' ? 'system' : 'light';
        console.log('[Theme] Switching from', prevMode, 'to', nextMode);
        localStorage.setItem('theme-preference', nextMode);
        if (process.env.NEXT_PUBLIC_E2E !== 'true') {
          const t = nextMode === 'system' ? Theme.SYSTEM : nextMode === 'dark' ? Theme.DARK : Theme.LIGHT;
          updateThemePreference(t).catch(e => console.error('[Theme] Update error:', e));
        }
        return nextMode;
      });
    }
  }), [mode]);
  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={getTheme(resolvedMode)}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
