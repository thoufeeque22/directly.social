'use client';

import React from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAppRefresh } from '@/hooks/useAppRefresh';

export const RefreshButton = () => {
  const { refresh, isRefreshing } = useAppRefresh();

  return (
    <Tooltip title="Refresh data">
      <IconButton 
        onClick={refresh} 
        disabled={isRefreshing}
        size="small"
        sx={{ 
          color: 'inherit',
          '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        }}
      >
        {isRefreshing ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <RefreshIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};
