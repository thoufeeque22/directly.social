'use server';

import { prisma } from '@/lib/core/prisma';
import { protectedAction } from '@/lib/core/action-utils';
import { revalidatePath } from 'next/cache';

/**
 * Fetches the latest 20 notifications for the authenticated user.
 */
export async function getNotifications() {
  return protectedAction(async (userId) => {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    
    // Format dates to strings for safe client-side transport
    return notifications.map(n => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    }));
  });
}

/**
 * Marks a single notification as read.
 */
export async function markNotificationAsRead(id: string) {
  return protectedAction(async (userId) => {
    await prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
    revalidatePath('/');
  });
}

/**
 * Marks all unread notifications as read for the user.
 */
export async function markAllNotificationsAsRead() {
  return protectedAction(async (userId) => {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    revalidatePath('/');
  });
}
