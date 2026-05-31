'use client';

import React from 'react';
import { List, Typography, Box, CircularProgress } from '@mui/material';
import NotificationItem from './NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * Renders a list of notifications or an empty state.
 */
export default function NotificationList() {
  const { notifications, loading } = useNotifications();

  if (loading && notifications.length === 0) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary" variant="body2">No notifications yet.</Typography>
      </Box>
    );
  }

  return (
    <List sx={{ p: 0, width: '100%' }}>
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
        />
      ))}
    </List>
  );
}
