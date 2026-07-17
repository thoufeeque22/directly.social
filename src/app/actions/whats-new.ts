"use server";

import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function getUnseenUpdates() {
  noStore();
  const session = await auth();
  if (!session?.user?.id) {
    console.log('[DEBUG] getUnseenUpdates - No session/user ID found');
    return [];
  }

  console.log(`[DEBUG] getUnseenUpdates - Fetching for User: ${session.user.id} (${session.user.email})`);

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

    console.log(`[DEBUG] getUnseenUpdates - Found ${updates.length} unseen updates in DB:`);
    updates.forEach(u => {
      console.log(`  -> ID: ${u.id}, Title: ${u.title}, Version: ${u.version}`);
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
  return protectedAction(async function markSeen(userId) {
    // Validate user existence to avoid foreign key constraints and provide better logging
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      console.error('[CRITICAL] markUpdateAsSeen - User not found in database for ID:', userId);
      return { success: false, error: 'User not found in database. Please re-login.' };
    }

    try {
      console.log(`[DEBUG] markUpdateAsSeen - Attempting upsert for User: ${userId}, Update: ${updateId}`);
      
      const result = await prisma.userSeenUpdate.upsert({
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
      
      console.log(`[DEBUG] markUpdateAsSeen - DB Upsert Successful:`, result.id);
      
      // Revalidate to purge router cache so updates don't reappear on reload
      // Wrap in try-catch because revalidatePath can sometimes throw in dev/specific environments
      try {
        await revalidateDashboard();
        console.log('[DEBUG] markUpdateAsSeen - Revalidation Successful');
      } catch (revalError) {
        console.warn('[DEBUG] markUpdateAsSeen - Revalidation failed (non-critical):', revalError);
      }
      
      return { success: true };
    } catch (error) {
      console.error('[ERROR] markUpdateAsSeen - Fatal Error:', error);
      return { success: false, error: 'Failed to mark update as seen.' };
    }
  });
}

export async function markUpdatesAsSeen(updateIds: string[]) {
  return protectedAction(async function markSeenBatch(userId) {
    if (!updateIds || updateIds.length === 0) return { success: true };
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error('[CRITICAL] markUpdatesAsSeen - User not found in database for ID:', userId);
      return { success: false, error: 'User not found in database. Please re-login.' };
    }

    try {
      console.log(`[DEBUG] markUpdatesAsSeen - Attempting batch insert for User: ${userId}, Updates: ${updateIds.length}`);
      
      const now = new Date();
      await prisma.userSeenUpdate.createMany({
        data: updateIds.map(id => ({
          userId,
          updateId: id,
          seenAt: now
        })),
        skipDuplicates: true
      });
      
      console.log(`[DEBUG] markUpdatesAsSeen - DB Batch Insert Successful`);
      
      try {
        await revalidateDashboard();
      } catch (revalError) {
        console.warn('[DEBUG] markUpdatesAsSeen - Revalidation failed (non-critical):', revalError);
      }
      
      return { success: true };
    } catch (error) {
      console.error('[ERROR] markUpdatesAsSeen - Fatal Error:', error);
      return { success: false, error: 'Failed to mark updates as seen.' };
    }
  });
}
