"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction } from '@/lib/core/action-utils';

// TODO: Refactor: logic extraction needed
/**
 * Cancels a platform distribution task.
 */
export async function cancelPlatformUploadAction(resultId: string) {
  return protectedAction(async (userId) => {
    const result = await prisma.postPlatformResult.findUnique({
      where: { id: resultId },
      include: { postHistory: true }
    });

    if (!result || result.postHistory.userId !== userId) {
      throw new Error('Upload result not found.');
    }

    await prisma.postPlatformResult.update({
      where: { id: resultId },
      data: { 
        status: 'cancelled',
        errorMessage: 'Stopped by user'
      }
    });

    return { success: true };
  });
}

/**
 * Cancels a specific platform distribution task by post ID and platform name.
 * Useful for optimistic UI states where the result ID isn't known yet.
 */
export async function cancelPlatformByPostAction(historyId: string, platform: string) {
  return protectedAction(async (userId) => {
    const result = await prisma.postPlatformResult.findFirst({
      where: { 
        postHistoryId: historyId,
        platform: platform,
        postHistory: { userId }
      }
    });

    if (!result) {
      throw new Error('Upload result not found.');
    }

    await prisma.postPlatformResult.update({
      where: { id: result.id },
      data: { 
        status: 'cancelled',
        errorMessage: 'Stopped by user'
      }
    });

    return { success: true };
  });
}

/**
 * Cancels all platform distribution tasks for a specific post.
 */
export async function cancelAllUploadsAction(historyId: string) {
  return protectedAction(async (userId) => {
    const history = await prisma.postHistory.findUnique({
      where: { id: historyId, userId },
      include: { platforms: true }
    });

    if (!history) throw new Error('Post history not found.');

    await prisma.postPlatformResult.updateMany({
      where: { 
        postHistoryId: historyId,
        status: { in: ['pending', 'uploading', 'processing', 'retrying'] }
      },
      data: { 
        status: 'cancelled',
        errorMessage: 'Stopped by user'
      }
    });

    return { success: true };
  });
}
