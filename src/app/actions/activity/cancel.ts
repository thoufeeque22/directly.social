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
      include: { postActivity: true }
    });

    if (!result || result.postActivity.userId !== userId) {
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
export async function cancelPlatformByPostAction(activityId: string, platform: string) {
  return protectedAction(async (userId) => {
    const result = await prisma.postPlatformResult.findFirst({
      where: { 
        postActivityId: activityId,
        platform: platform,
        postActivity: { userId }
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
export async function cancelAllUploadsAction(activityId: string) {
  return protectedAction(async (userId) => {
    const activity = await prisma.postActivity.findUnique({
      where: { id: activityId, userId },
      include: { platforms: true }
    });

    if (!activity) throw new Error('Post activity not found.');

    await prisma.postPlatformResult.updateMany({
      where: { 
        postActivityId: activityId,
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
