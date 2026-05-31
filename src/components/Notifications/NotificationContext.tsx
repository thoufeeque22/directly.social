'use client';
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/app/actions/notifications';
import { Notification } from '@/lib/schemas/notifications';
import { NotificationContextType } from './types';

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchNotifications = useCallback(async () => {
    if (status !== 'authenticated') {
      setNotifications([]); setLoading(false); return;
    }
    try {
      const data = await getNotifications();
      setNotifications(data as Notification[]);
    } catch (error) {
      console.warn('[Notifications] Failed to fetch:', error);
    } finally { setLoading(false); }
  }, [status]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    if (status === 'authenticated') {
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [fetchNotifications, status]);
  const markAsRead = useCallback(async (id: string) => {
    if (status !== 'authenticated') return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await markNotificationAsRead(id).catch(fetchNotifications);
  }, [fetchNotifications, status]);
  const markAllAsRead = useCallback(async () => {
    if (status !== 'authenticated') return;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    await markAllNotificationsAsRead().catch(fetchNotifications);
  }, [fetchNotifications, status]);
  const value = useMemo(() => ({
    notifications, unreadCount: notifications.filter(n => !n.isRead).length,
    loading, markAsRead, markAllAsRead, refresh: fetchNotifications,
  }), [notifications, loading, markAsRead, markAllAsRead, fetchNotifications]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
