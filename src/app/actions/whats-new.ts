
"use server";

import { prisma } from '@/lib/core/prisma';
import { auth } from '@/auth';

export async function getUnseenUpdates() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Fetch updates and map them to the format expected by the hook.
  const updates = await prisma.updateLog.findMany({
    where: {
      seenBy: {
        none: {
          userId: session.user.id,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return updates.map(u => ({
    id: u.id,
    title: u.title,
    description: u.description,
    date: u.createdAt.toISOString(), // Map createdAt to date string
  }));
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
