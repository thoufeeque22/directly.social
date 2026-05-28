"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction } from '@/lib/core/action-utils';

/**
 * Fetches upcoming scheduled posts.
 */
export async function getUpcomingPosts() {
  return protectedAction(async (userId) => {
    return await prisma.postActivity.findMany({
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
