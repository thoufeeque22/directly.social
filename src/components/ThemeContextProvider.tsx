/* eslint-disable max-lines */
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '@/theme';
import { updateThemePreference } from '@/app/actions/user';
import { Theme } from '@prisma/client';
import { ColorMode, ThemeContext } from './ThemeContext';

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ColorMode>(() => (typeof window !== 'undefined' && localStorage.getItem('theme-preference') as ColorMode) || 'system');
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('dark');
  useEffect(() => {
    (async () => {
      const { getThemePreference } = await import('@/app/actions/user');
      const pref = await getThemePreference();
      const modePref = pref.toLowerCase() as ColorMode;
      if (modePref && modePref !== mode) {
        setMode(modePref);
        localStorage.setItem('theme-preference', modePref);
      }
    })().catch(() => {});
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
      const t = m === 'system' ? Theme.SYSTEM : m === 'dark' ? Theme.DARK : Theme.LIGHT;
      updateThemePreference(t).catch(() => {});
    },
    toggleMode: () => {
      const nextMode: ColorMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
      value.setMode(nextMode);
    }
  }), [mode]);
  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={getTheme(resolvedMode)}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
