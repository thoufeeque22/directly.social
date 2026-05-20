'use server';

import { prisma } from '@/lib/core/prisma';
import { auth } from '@/auth';

export async function getUnseenUpdates() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.updateLog.findMany({
    where: {
      seenBy: {
        none: {
          userId: session.user.id,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markUpdateAsSeen(updateId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  return prisma.userSeenUpdate.create({
    data: {
      userId: session.user.id,
      updateId,
    },
  });
}
