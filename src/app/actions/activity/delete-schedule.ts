"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import { syncGalleryExpiry } from './activity-helpers';
import { deleteScheduledPost as internalDelete } from './delete-post';

export async function publishNowAction(id: string) {
  return protectedAction(async (userId) => {
    const post = await prisma.postActivity.findUnique({
      where: { id, userId }
    });

    if (!post || post.isPublished) throw new Error('Post not found or already published.');

    const updated = await prisma.postActivity.update({
      where: { id },
      data: { scheduledAt: new Date() }
    });

    await syncGalleryExpiry(updated.stagedFileId, updated.scheduledAt);
    await revalidateDashboard();
    return updated;
  });
}

export async function deleteScheduledPost(id: string) {
  return await internalDelete(id);
}
