"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import path from 'path';
import fs from 'fs';
import { logger } from '@/lib/core/logger';
import { syncGalleryExpiry } from './utils';

/**
 * Marks a scheduled post to be published ASAP.
 */
export async function publishNowAction(id: string) {
  return protectedAction(async (userId) => {
    const post = await prisma.postHistory.findUnique({
      where: { id, userId }
    });

    if (!post || post.isPublished) throw new Error('Post not found or already published.');

    const updated = await prisma.postHistory.update({
      where: { id },
      data: { scheduledAt: new Date() }
    });

    await syncGalleryExpiry(updated.stagedFileId, updated.scheduledAt);
    await revalidateDashboard();
    return updated;
  });
}

/**
 * Deletes a scheduled post.
 */
export async function deleteScheduledPost(id: string) {
  return protectedAction(async (userId) => {
    const post = await prisma.postHistory.findUnique({
      where: { id, userId }
    });

    if (!post || post.isPublished) throw new Error('Post not found or already published.');

    if (post.stagedFileId) {
      try {
        const filePath = path.join(process.cwd(), "src/tmp", post.stagedFileId);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e: unknown) {
        logger.warn("Failed to delete temp file", e);
      }
    }

    const deleted = await prisma.postHistory.delete({ where: { id } });

    await revalidateDashboard();
    return deleted;
  });
}
