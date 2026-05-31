'use client';

import React from 'react';
import { Popover, Box, Typography, Button, Divider } from '@mui/material';
import NotificationList from './NotificationList';
import { useNotifications } from '@/hooks/useNotifications';

interface Props {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
}

/**
 * Popover containing the notification list.
 */
export default function NotificationPopover({ anchorEl, onClose }: Props) {
  const { markAllAsRead, unreadCount } = useNotifications();
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: { width: 360, maxHeight: 480 } } }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
        {unreadCount > 0 && (
          <Button size="small" onClick={markAllAsRead}>Mark all as read</Button>
        )}
      </Box>
      <Divider />
      <NotificationList />
    </Popover>
  );
}
