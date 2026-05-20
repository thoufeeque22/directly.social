"use server";

import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client'; // Import raw client directly

export async function getUnseenUpdates() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Temporary clean instance bypass to confirm if schema is sound
  const rawPrisma = new PrismaClient();

  const updates = await rawPrisma.updateLog.findMany({
    where: {
      seenBy: {
        none: {
          userId: session.user.id,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return updates.map((u) => ({
    id: u.id,
    title: u.title,
    description: u.description,
    date: u.createdAt.toISOString(),
  }));
}

export async function markUpdateAsSeen(updateId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const rawPrisma = new PrismaClient();

  return rawPrisma.userSeenUpdate.create({
    data: {
      userId: session.user.id,
      updateId,
    },
  });
}