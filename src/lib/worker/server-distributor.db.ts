import { prisma } from '@/lib/core/prisma';
import { Prisma } from '@prisma/client';
import { DistributionResult } from './server-distributor';

export async function fetchExistingResult(activityId: string, platform: string, accountId: string) {
  return prisma.postPlatformResult.findUnique({
    where: {
      postActivityId_platform_accountId: {
        postActivityId: activityId,
        platform,
        accountId
      }
    }
  });
}

export async function upsertPlatformResult(activityId: string, platform: string, accountId: string, data: Partial<DistributionResult> & { accountName?: string | null }) {
  return prisma.postPlatformResult.upsert({
    where: {
      postActivityId_platform_accountId: {
        postActivityId: activityId,
        platform,
        accountId
      }
    },
    update: { ...data, postActivityId: activityId },
    create: { ...data, platform, accountId, postActivityId: activityId } as Prisma.PostPlatformResultUncheckedCreateInput
  });
}

export async function updatePlatformProgress(resultId: string, percent: number) {
  return prisma.postPlatformResult.update({
    where: { id: resultId },
    data: { progress: Math.round(percent) }
  });
}

export async function recordPlatformFailure(activityId: string, platform: string, accountId: string, error: unknown) {
  const err = error as { 
    message?: string; 
    resumableUrl?: string | null; 
    videoId?: string | null; 
    creationId?: string | null 
  };

  const errorPayload = {
    platform,
    accountId,
    status: 'failed' as const,
    errorMessage: err.message || 'Unknown error',
    resumableUrl: err.resumableUrl,
    videoId: err.videoId,
    creationId: err.creationId,
    lastRetryAt: new Date()
  };

  return prisma.postPlatformResult.upsert({
    where: {
      postActivityId_platform_accountId: {
        postActivityId: activityId,
        platform,
        accountId
      }
    },
    update: { ...errorPayload, retryCount: { increment: 1 } },
    create: { ...errorPayload, postActivityId: activityId, retryCount: 1 }
  });
}