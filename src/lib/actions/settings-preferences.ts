'use server';

import { protectedAction } from '@/lib/core/action-utils';
import { prisma } from '@/lib/core/prisma';

export async function getUserPreferencesAction() {
  return protectedAction(async function getUserPrefs(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { preference: true }
      });
      return { success: true, preference: user?.preference || null };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}

export async function updateUserPreferencesAction(data: {
  timezone: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  pushNotifications: boolean;
}) {
  return protectedAction(async function updateUserPrefs(userId) {
    try {
      const preference = await prisma.userPreference.upsert({
        where: { userId },
        update: data,
        create: {
          userId,
          ...data
        }
      });
      return { success: true, preference };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}
