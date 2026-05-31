'use client';
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/app/actions/notifications';
import { Notification } from '@/lib/schemas/notifications';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data as Notification[]);
    } catch { /* Fail silently */ } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);
  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await markNotificationAsRead(id).catch(fetchNotifications);
  }, [fetchNotifications]);
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    await markAllNotificationsAsRead().catch(fetchNotifications);
  }, [fetchNotifications]);
  const value = useMemo(() => ({
    notifications, unreadCount: notifications.filter(n => !n.isRead).length,
    loading, markAsRead, markAllAsRead, refresh: fetchNotifications,
  }), [notifications, loading, markAsRead, markAllAsRead, fetchNotifications]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
