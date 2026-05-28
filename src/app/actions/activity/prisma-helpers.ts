import { prisma } from '@/lib/core/prisma';
import { Prisma } from '@prisma/client';

export type ResultWithActivity = Prisma.PostPlatformResultGetPayload<{
  include: { postActivity: true }
}>;

export async function findResultOrThrow(resultId: string, userId: string): Promise<ResultWithActivity> {
  const result = await prisma.postPlatformResult.findUnique({
    where: { id: resultId },
    include: { postActivity: true }
  });
  if (!result || result.postActivity.userId !== userId) {
    throw new Error('Upload result not found.');
  }
  return result as ResultWithActivity;
}

export async function findActivityOrThrow(activityId: string, userId: string) {
  const activity = await prisma.postActivity.findUnique({
    where: { id: activityId, userId },
    include: { platforms: true }
  });
  if (!activity) throw new Error('Post activity not found.');
  return activity;
}

export async function updatePlatformStatus(resultId: string, status: string, errorMessage: string | null = null) {
  return await prisma.postPlatformResult.update({
    where: { id: resultId },
    data: { status, errorMessage } as Prisma.PostPlatformResultUpdateInput
  });
}
