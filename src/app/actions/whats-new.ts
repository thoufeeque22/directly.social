"use server";

import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { protectedAction } from '@/lib/core/action-utils';

export async function getUnseenUpdates() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const updates = await prisma.updateLog.findMany({
      where: {
        seenBy: {
          none: {
            userId: session.user.id,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return updates.map((u) => ({
      id: u.id,
      title: u.title,
      description: u.description,
      date: u.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('[ERROR] getUnseenUpdates:', error);
    return [];
  }
}

export async function markUpdateAsSeen(updateId: string) {
  return protectedAction(async (userId) => {
    // Validate user existence to avoid foreign key constraints and provide better logging
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      console.error('[CRITICAL] markUpdateAsSeen - User not found in database for ID:', userId);
      return { success: false, error: 'User not found in database. Please re-login.' };
    }

    try {
      await prisma.userSeenUpdate.upsert({
        where: {
          userId_updateId: {
            userId,
            updateId,
          },
        },
        update: {
          seenAt: new Date(),
        },
        create: {
          userId,
          updateId,
        },
      });
      return { success: true };
    } catch (error) {
      console.error('[ERROR] markUpdateAsSeen:', error);
      return { success: false, error: 'Failed to mark update as seen.' };
    }
  });
}
