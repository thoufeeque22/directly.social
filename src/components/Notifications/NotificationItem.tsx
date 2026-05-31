'use client';

import React from 'react';
import { ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Notification } from '@/lib/schemas/notifications';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { getNotificationIcon } from './NotificationIcons';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.isRead) onMarkAsRead(notification.id);
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
      <ListItemIcon sx={{ minWidth: 36 }}>{getNotificationIcon(notification.type)}</ListItemIcon>
      <ListItemText
        primary={<Typography variant="body2" sx={{ fontWeight: notification.isRead ? 400 : 600 }}>{notification.message}</Typography>}
        secondary={<Typography variant="caption" color="text.secondary">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</Typography>}
      />
    </ListItem>
  );
}
