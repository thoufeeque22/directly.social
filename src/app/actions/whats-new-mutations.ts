"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';

export async function markUpdateAsSeen(updateId: string) {
  return protectedAction(async function markSeen(userId) {
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
