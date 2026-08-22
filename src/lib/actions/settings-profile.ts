'use server';

import { protectedAction } from '@/lib/core/action-utils';
import { prisma } from '@/lib/core/prisma';

export async function getUserProfileAction() {
  return protectedAction(async function getUserProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, image: true, personalNotes: true }
      });
      return { success: true, user };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}

export async function updateUserProfileAction(data: { personalNotes: string }) {
  return protectedAction(async function updateUserProfile(userId) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { personalNotes: data.personalNotes }
      });
      return { success: true, user };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}
