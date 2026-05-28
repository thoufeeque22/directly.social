import { prisma } from '@/lib/core/prisma';
import { PlatformResultInput } from './schema';

export async function upsertPlatformResultInternal(userId: string, activityId: string, result: PlatformResultInput) {
  const activity = await prisma.postActivity.findUnique({
    where: { id: activityId, userId: userId }
  });
  if (!activity) throw new Error('Activity entry not found');

  return await prisma.postPlatformResult.upsert({
    where: {
      postActivityId_platform_accountId: {
        postActivityId: activityId,
        platform: result.platform,
        accountId: result.accountId || ''
      }
    },
    update: { ...result, postActivityId: activityId },
    create: { ...result, postActivityId: activityId }
  });
}
