'use client';

import React from 'react';
import { ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Info, CheckCircle, Warning, Error as ErrorIcon } from '@mui/icons-material';
import { Notification } from '@/lib/schemas/notifications';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'SUCCESS': return <CheckCircle color="success" fontSize="small" />;
    case 'WARNING': return <Warning color="warning" fontSize="small" />;
    case 'ERROR': return <ErrorIcon color="error" fontSize="small" />;
    default: return <Info color="info" fontSize="small" />;
  }
};

/**
 * Individual notification item.
 */
export default function NotificationItem({ notification }: { notification: Notification }) {
  const { markAsRead } = useNotifications();
  const router = useRouter();

  const handleClick = () => {
    if (!notification.isRead) markAsRead(notification.id);
    if (notification.link) {
      if (notification.link.startsWith('http')) {
        window.location.href = notification.link;
      } else {
        router.push(notification.link);
      }
    }
  };

  return (
    <ListItem
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        backgroundColor: notification.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
        '&:hover': { backgroundColor: 'action.hover' },
        borderBottom: '1px solid', borderColor: 'divider',
      }}
    >
      <ListItemIcon sx={{ minWidth: 36 }}>{getIcon(notification.type)}</ListItemIcon>
      <ListItemText
        primary={<Typography variant="body2" sx={{ fontWeight: notification.isRead ? 400 : 600 }}>{notification.message}</Typography>}
        secondary={<Typography variant="caption" color="text.secondary">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</Typography>}
      />
    </ListItem>
  );
}
