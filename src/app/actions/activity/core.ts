"use server";

import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import { SavePostActivityInput, SavePostActivitySchema, PlatformResultInput } from './schema';
import { generateAutoTitle, mapPlatformInputs } from './activity-helpers';
import { upsertPlatformResultInternal } from './upsert-helpers';
import { prisma } from '@/lib/core/prisma';

export async function upsertPlatformResult(activityId: string, result: PlatformResultInput) {
  return protectedAction(async (userId) => {
    return await upsertPlatformResultInternal(userId, activityId, result);
  });
}

export async function savePostActivity(rawInput: SavePostActivityInput) {
  return protectedAction(async (userId) => {
    const validated = SavePostActivitySchema.parse(rawInput);
    const { title, description, videoFormat, platforms, stagedFileId, scheduledAt, isPublished } = validated;

    const finalTitle = await generateAutoTitle(userId, title);

    const postActivity = await prisma.postActivity.create({
      data: {
        userId,
        title: finalTitle,
        description,
        videoFormat,
        stagedFileId,
        scheduledAt: scheduledAt ?? new Date(),
        isPublished: isPublished ?? false,
        platforms: { create: mapPlatformInputs(platforms) },
      },
      include: { platforms: true },
    });

    await revalidateDashboard();
    return { success: true, data: postActivity };
  });
}
