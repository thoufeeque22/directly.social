'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '@/app/actions/notifications';
import { Notification } from '@/lib/schemas/notifications';

export function useNotifications() {
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
  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await markNotificationAsRead(id).catch(fetchNotifications);
  };
  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    await markAllNotificationsAsRead().catch(fetchNotifications);
  };
  return {
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
