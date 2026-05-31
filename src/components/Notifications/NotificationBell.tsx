'use client';

import React, { useState } from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationPopover from './NotificationPopover';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * Bell icon with unread count badge.
 */
export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { unreadCount } = useNotifications();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleOpen}
          data-testid="notification-bell"
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationPopover
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </>
  );
}
