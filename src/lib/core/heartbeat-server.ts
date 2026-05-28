import { prisma } from "./prisma";

/**
 * SERVER-ONLY: Updates the progress of a platform distribution in the database.
 * Ensures progress only moves forward.
 */
export const updatePlatformProgress = async (activityId: string, platform: string, accountId: string, progress: number) => {
  try {
    const current = await prisma.postPlatformResult.findUnique({
      where: {
        postActivityId_platform_accountId: {
          postActivityId: activityId,
          platform,
          accountId
        }
      },
      select: { progress: true }
    });

    if (!current || progress > current.progress) {
      await prisma.postPlatformResult.update({
        where: {
          postActivityId_platform_accountId: {
            postActivityId: activityId,
            platform,
            accountId
          }
        },
        data: { progress }
      });
    }
  } catch (err) {
    // Silent fail for progress updates
  }
};
