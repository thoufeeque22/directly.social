"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import { logger } from '@/lib/core/logger';
import { SavePostHistoryInput, SavePostHistorySchema, PlatformResultInput } from './schema';

/**
 * Upserts a single platform result (Internal version for Worker).
 */
export async function upsertPlatformResultInternal(userId: string, historyId: string, result: PlatformResultInput) {
  const history = await prisma.postHistory.findUnique({
    where: { id: historyId, userId: userId }
  });
  if (!history) throw new Error('History entry not found');

  return await prisma.postPlatformResult.upsert({
    where: {
      postHistoryId_platform_accountId: {
        postHistoryId: historyId,
        platform: result.platform,
        accountId: result.accountId || ''
      }
    },
    update: { ...result, postHistoryId: historyId },
    create: { ...result, postHistoryId: historyId }
  });
}

/**
 * Upserts a single platform result for a post history entry (Authenticated).
 */
export async function upsertPlatformResult(historyId: string, result: PlatformResultInput) {
  return protectedAction(async (userId) => {
    return await upsertPlatformResultInternal(userId, historyId, result);
  });
}

// TODO: Refactor: logic extraction needed
export async function savePostHistory(rawInput: SavePostHistoryInput) {
  return protectedAction(async (userId) => {
    const validated = SavePostHistorySchema.parse(rawInput);
    const { title, description, videoFormat, platforms, stagedFileId, scheduledAt, isPublished } = validated;

    let finalTitle = title;
    if (!finalTitle || finalTitle.trim() === "" || /^\d+$/.test(finalTitle)) {
      const lastPost = await prisma.postHistory.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      const lastNum = parseInt(lastPost?.title.match(/\d+/)?.[0] || "0", 10);
      finalTitle = `${lastNum + 1}`;
      logger.info(`[DEV-AUTO-TITLE] Incrementing title to: ${finalTitle}`);
    }

    const postHistory = await prisma.postHistory.create({
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
            metadata: p.metadata || null,
          })),
        },
      },
      include: { platforms: true },
    });

    await revalidateDashboard();
    return { success: true, data: postHistory };
  });
}
