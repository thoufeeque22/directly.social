'use server';

import { protectedAction } from '@/lib/core/action-utils';
import { prisma } from '@/lib/core/prisma';

export async function getUserProfileAction() {
  return protectedAction(async function getUserProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, image: true }
      });
      return { success: true, user };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}
