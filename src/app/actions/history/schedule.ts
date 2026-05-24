"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import path from 'path';
import fs from 'fs';
import { logger } from '@/lib/core/logger';

/**
 * Fetches upcoming scheduled posts.
 */
export async function getUpcomingPosts() {
  return protectedAction(async (userId) => {
    return await prisma.postHistory.findMany({
      where: {
        userId,
        isPublished: false
      },
      orderBy: {
        scheduledAt: 'asc'
      },
      take: 5
    });
  }).catch(() => []);
}

/**
 * Updates a scheduled post (before it is published).
 */
export async function updateScheduledPost(id: string, data: { title?: string; description?: string; scheduledAt?: string }) {
  return protectedAction(async (userId) => {
    const post = await prisma.postHistory.findUnique({
      where: { id, userId }
    });

    if (!post || post.isPublished) throw new Error('Post not found or already published.');

    const updated = await prisma.postHistory.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined
      }
    });

    // Sync GalleryAsset expiry
    if (updated.stagedFileId && updated.scheduledAt) {
      const newExpiry = new Date(updated.scheduledAt.getTime() + 48 * 60 * 60 * 1000);
      await prisma.galleryAsset.updateMany({
        where: { fileId: updated.stagedFileId },
        data: { expiresAt: newExpiry }
      }).catch((e: unknown) => logger.warn("Failed to sync gallery expiry", e));
    }

    await revalidateDashboard();
    return updated;
  });
}

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

    // Sync GalleryAsset expiry
    if (updated.stagedFileId && updated.scheduledAt) {
      const newExpiry = new Date(updated.scheduledAt.getTime() + 48 * 60 * 60 * 1000);
      await prisma.galleryAsset.updateMany({
        where: { fileId: updated.stagedFileId },
        data: { expiresAt: newExpiry }
      }).catch((e: unknown) => logger.warn("Failed to sync gallery expiry", e));
    }

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
