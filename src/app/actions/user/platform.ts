"use server";

import { prisma } from "@/lib/core/prisma";
import { protectedAction, revalidateDashboard } from "@/lib/core/action-utils";

/**
 * Fetches platform preferences for the current user.
 */
export async function getPlatformPreferences() {
  return protectedAction(async function fetchPlatformPreferences(userId) {
    if (process.env.NEXT_PUBLIC_E2E === 'true') {
      return [
        { id: 'mock-pref-1', userId: 'e2e-tester-id-stable', platformId: 'youtube', isEnabled: true },
        { id: 'mock-pref-2', userId: 'e2e-tester-id-stable', platformId: 'facebook', isEnabled: true },
        { id: 'mock-pref-3', userId: 'e2e-tester-id-stable', platformId: 'instagram', isEnabled: true },
        { id: 'mock-pref-4', userId: 'e2e-tester-id-stable', platformId: 'tiktok', isEnabled: true }
      ];
    }
    return await prisma.platformPreference.findMany({
      where: { userId }
    });
  }).catch(() => []);
}

/**
 * Updates a platform preference (Enable/Disable).
 */
export async function togglePlatformPreference(platformId: string, isEnabled: boolean) {
  return protectedAction(async function updatePref(userId) {
    await prisma.platformPreference.upsert({
      where: {
        userId_platformId: {
          userId,
          platformId
        }
      },
      update: { isEnabled },
      create: {
        userId,
        platformId,
        isEnabled
      }
    });

    await revalidateDashboard();
    return { success: true };
  });
}
