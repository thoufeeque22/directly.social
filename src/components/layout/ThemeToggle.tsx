'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, WbSunny, SettingsBrightness } from '@mui/icons-material';
import { useThemeContext, ColorMode } from '@/components/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useThemeContext();

  const getIcon = (currentMode: ColorMode) => {
    switch (currentMode) {
      case 'light': return <DarkMode />;
      case 'dark': return <SettingsBrightness />;
      case 'system': return <WbSunny />;
    }
  };

  const getTooltip = (currentMode: ColorMode) => {
    switch (currentMode) {
      case 'light': return 'Switch to Dark Mode';
      case 'dark': return 'Switch to System Default';
      case 'system': return 'Switch to Light Mode';
    }
  };

  return (
    <Tooltip title={getTooltip(mode)}>
      <IconButton 
        onClick={toggleMode} 
        color="inherit"
        data-testid="theme-toggle"
      >
        {getIcon(mode)}
      </IconButton>
    </Tooltip>
  );
};
