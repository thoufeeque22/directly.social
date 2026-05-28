"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction } from '@/lib/core/action-utils';
import { executeRetry } from './retry-executor';

export async function retryUploadAction(resultId: string) {
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
         status: 'retrying',
         errorMessage: null,
         retryCount: { increment: 1 },
         lastRetryAt: new Date()
       }
    });

    return await executeRetry(resultId, result, userId);
  });
}
