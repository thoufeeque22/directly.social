'use client';

import React from 'react';
import { Info, CheckCircle, Warning, Error as ErrorIcon } from '@mui/icons-material';
import { Notification } from '@/lib/schemas/notifications';

export const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'SUCCESS': return <CheckCircle color="success" fontSize="small" />;
    case 'WARNING': return <Warning color="warning" fontSize="small" />;
    case 'ERROR': return <ErrorIcon color="error" fontSize="small" />;
    default: return <Info color="info" fontSize="small" />;
  }
};
