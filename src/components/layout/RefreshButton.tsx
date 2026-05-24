'use client';

import React, { useState, useRef } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';

export const RefreshButton = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);

  const handleRefresh = async () => {
    if (isRefreshingRef.current) return;
    
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    
    // 1. Refresh server components
    router.refresh();

    // 2. Dispatch global events for client components
    globalThis.dispatchEvent(new CustomEvent('refresh-upcoming'));
    globalThis.dispatchEvent(new CustomEvent('app:refresh'));

    // Artificial delay for better UX (feedback that something happened)
    setTimeout(() => {
      setIsRefreshing(false);
      isRefreshingRef.current = false;
    }, 1000);
  };

  return (
    <Tooltip title="Refresh data">
      <IconButton 
        onClick={handleRefresh} 
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
