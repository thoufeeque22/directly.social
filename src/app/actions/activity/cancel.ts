"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction } from '@/lib/core/action-utils';
import { updatePlatformStatus, findResultOrThrow, findActivityOrThrow } from './prisma-helpers';

export async function cancelPlatformUploadAction(resultId: string) {
  return protectedAction(async (userId) => {
    await findResultOrThrow(resultId, userId);
    await updatePlatformStatus(resultId, 'cancelled', 'Stopped by user');
    return { success: true };
  });
}

export async function cancelPlatformByPostAction(activityId: string, platform: string) {
  return protectedAction(async (userId) => {
    const result = await prisma.postPlatformResult.findFirst({
      where: { postActivityId: activityId, platform, postActivity: { userId } }
    });
    if (!result) throw new Error('Upload result not found.');
    await updatePlatformStatus(result.id, 'cancelled', 'Stopped by user');
    return { success: true };
  });
}

export async function cancelAllUploadsAction(activityId: string) {
  return protectedAction(async (userId) => {
    await findActivityOrThrow(activityId, userId);
    await prisma.postPlatformResult.updateMany({
      where: { 
        postActivityId: activityId,
        status: { in: ['pending', 'uploading', 'processing', 'retrying'] }
      },
      data: { status: 'cancelled', errorMessage: 'Stopped by user' }
    });
    return { success: true };
  });
}
