"use server";

import { prisma } from '@/lib/core/prisma';
import { unstable_noStore as noStore } from 'next/cache';

export async function getRecentUpdates(limit: number = 5) {
  noStore();
  try {
    const updates = await prisma.updateLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return updates.map((u) => ({
      id: u.id,
      title: u.title,
      description: u.description,
      date: u.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('[ERROR] getRecentUpdates:', error);
    return [];
  }
}
