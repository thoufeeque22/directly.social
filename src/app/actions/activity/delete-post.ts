"use server";
import os from "os";

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import path from 'path';
import fs from 'fs';
import { logger } from '@/lib/core/logger';

export async function deleteScheduledPost(id: string) {
  return protectedAction(async (userId) => {
    const post = await prisma.postActivity.findUnique({
      where: { id, userId }
    });

    if (!post || post.isPublished) throw new Error('Post not found or already published.');

    if (post.stagedFileId) {
      try {
        const filePath = path.join(os.tmpdir(), "directly_social", post.stagedFileId);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e: unknown) {
        logger.warn("Failed to delete temp file", e);
      }
    }

    const deleted = await prisma.postActivity.delete({ where: { id } });

    await revalidateDashboard();
    return deleted;
  });
}
