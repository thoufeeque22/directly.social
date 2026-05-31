'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, WbSunny } from '@mui/icons-material';
import { useThemeContext } from '@/components/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useThemeContext();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton 
        onClick={toggleMode} 
        color="inherit"
        data-testid="theme-toggle"
      >
        {mode === 'light' ? <DarkMode /> : <WbSunny />}
      </IconButton>
    </Tooltip>
  );
};
