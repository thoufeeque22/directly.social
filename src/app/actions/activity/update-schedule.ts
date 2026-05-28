"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import { syncGalleryExpiry } from './activity-helpers';

/**
 * Updates a scheduled post (before it is published).
 */
export async function updateScheduledPost(id: string, data: { title?: string; description?: string; scheduledAt?: string }) {
  return protectedAction(async (userId) => {
    const post = await prisma.postActivity.findUnique({
      where: { id, userId }
    });

    if (!post || post.isPublished) throw new Error('Post not found or already published.');

    const updated = await prisma.postActivity.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined
      }
    });

    await syncGalleryExpiry(updated.stagedFileId, updated.scheduledAt);
    await revalidateDashboard();
    return updated;
  });
}
