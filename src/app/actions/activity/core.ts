"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import { logger } from '@/lib/core/logger';
import { SavePostActivityInput, SavePostActivitySchema, PlatformResultInput } from './schema';

/**
 * Upserts a single platform result (Internal version for Worker).
 */
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

/**
 * Upserts a single platform result for a post activity entry (Authenticated).
 */
export async function upsertPlatformResult(activityId: string, result: PlatformResultInput) {
  return protectedAction(async (userId) => {
    return await upsertPlatformResultInternal(userId, activityId, result);
  });
}

// TODO: Refactor: logic extraction needed
export async function savePostActivity(rawInput: SavePostActivityInput) {
  return protectedAction(async (userId) => {
    const validated = SavePostActivitySchema.parse(rawInput);
    const { title, description, videoFormat, platforms, stagedFileId, scheduledAt, isPublished } = validated;

    let finalTitle = title;
    if (!finalTitle || finalTitle.trim() === "" || /^\d+$/.test(finalTitle)) {
      const lastPost = await prisma.postActivity.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      const lastNum = parseInt(lastPost?.title.match(/\d+/)?.[0] || "0", 10);
      finalTitle = `${lastNum + 1}`;
      logger.info(`[DEV-AUTO-TITLE] Incrementing title to: ${finalTitle}`);
    }

    const postActivity = await prisma.postActivity.create({
      data: {
        userId,
        title: finalTitle,
        description,
        videoFormat,
        stagedFileId,
        scheduledAt: scheduledAt ?? new Date(),
        isPublished: isPublished ?? false,
        platforms: {
          create: platforms.map((p) => ({
            ...p,
            accountName: p.accountName || null,
            platformPostId: p.platformPostId || null,
            permalink: p.permalink || null,
            errorMessage: p.errorMessage || null,
            resumableUrl: p.resumableUrl || null,
            videoId: p.videoId || null,
            creationId: p.creationId || null,
            metadata: p.metadata ?? undefined,
          })),
        },
      },
      include: { platforms: true },
    });

    await revalidateDashboard();
    return { success: true, data: postActivity };
  });
}
