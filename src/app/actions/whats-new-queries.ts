"use server";

import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { unstable_noStore as noStore } from 'next/cache';

export async function getUnseenUpdates() {
  noStore();
  const session = await auth();
  if (!session?.user?.id) {
    console.log('[DEBUG] getUnseenUpdates - No session/user ID found');
    return [];
  }

  console.log(`[DEBUG] getUnseenUpdates - Fetching for User: ${session.user.id} (${session.user.email})`);

  try {
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

    console.log(`[DEBUG] getUnseenUpdates - Found ${updates.length} unseen updates in DB:`);
    updates.forEach(u => {
      console.log(`  -> ID: ${u.id}, Title: ${u.title}, Version: ${u.version}`);
    });

    return updates.map((u) => ({
      id: u.id,
      title: u.title,
      description: u.description,
      date: u.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('[ERROR] getUnseenUpdates:', error);
    return [];
  }
}
