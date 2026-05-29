/* eslint-disable max-lines */
"use server";

import { prisma } from "@/lib/core/prisma";
import { protectedAction, revalidateDashboard } from "@/lib/core/action-utils";

/**
 * Fetches all connected accounts for the current authenticated user.
 */
export async function getUserAccounts() {
  return protectedAction(async function fetchUserAccounts(userId) {
    if (process.env.NEXT_PUBLIC_E2E === 'true' && userId === 'e2e-tester-id-stable') {
       return [
         { id: 'mock-youtube-acc', provider: 'google', accountName: 'Mock YouTube Channel', isDistributionEnabled: true },
         { id: 'mock-facebook-acc', provider: 'facebook', accountName: 'Mock Facebook Page', isDistributionEnabled: true }
       ];
    }
    return await prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        accountName: true,
        isDistributionEnabled: true,
      }
    });
  }).catch(() => []); // Graceful fallback to empty list
}

/**
 * Fetches platform preferences for the current user.
 */
export async function getPlatformPreferences() {
  return protectedAction(async function fetchPlatformPreferences(userId) {
    if (process.env.NEXT_PUBLIC_E2E === 'true' && userId === 'e2e-tester-id-stable') {
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
 * Updates a specific platform's distribution enabled status.
 */
export async function toggleAccountDistribution(accountId: string, isEnabled: boolean) {
  return protectedAction(async function toggleAccount(userId) {
    await prisma.account.update({
      where: { id: accountId, userId },
      data: { isDistributionEnabled: isEnabled }
    });

    await revalidateDashboard();
    return { success: true };
  });
}

/**
 * Disconnects an account for the user.
 */
export async function disconnectAccount(accountId: string) {
  return protectedAction(async function removeAccount(userId) {
    await prisma.account.delete({
      where: { id: accountId, userId }
    });

    await revalidateDashboard();
    return { success: true };
  });
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

/**
 * Fetches user AI Tier preference.
 */
export async function getAIStylePreference() {
  return protectedAction(async function fetchAiTier(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferredAIStyle: true }
    });
    return user?.preferredAIStyle || "Manual";
  }).catch(() => "Manual");
}

/**
 * Updates user AI Tier preference.
 */
export async function updateAIStylePreference(tier: string) {
  return protectedAction(async function updateAiTier(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { preferredAIStyle: tier }
    });

    await revalidateDashboard();
    return { success: true };
  });
}

/**
 * Fetches user preferred AI Provider.
 */
export async function getAIProviderPreference() {
  return protectedAction(async function fetchAiProvider(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferredAIProvider: true }
    });
    return user?.preferredAIProvider || "gemini";
  }).catch(() => "gemini");
}

/**
 * Updates user preferred AI Provider.
 */
export async function updateAIProviderPreference(provider: string) {
  return protectedAction(async function updateAiProvider(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { preferredAIProvider: provider }
    });

    await revalidateDashboard();
    return { success: true };
  });
}

/**
 * Fetches user preferred Video Format.
 */
export async function getVideoFormatPreference() {
  return protectedAction(async function fetchVideoFormat(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferredVideoFormat: true }
    });
    return user?.preferredVideoFormat || "short";
  }).catch(() => "short");
}

/**
 * Updates user preferred Video Format.
 */
export async function updateVideoFormatPreference(format: string) {
  return protectedAction(async function updateVideoFormat(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { preferredVideoFormat: format }
    });

    await revalidateDashboard();
    return { success: true };
  });
}

/**
 * Fetches user preferred AI Style Mode (Smart, Gen-Z, etc.).
 */
export async function getAIStyleModePreference() {
  return protectedAction(async function fetchAiMode(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferredAIStyleMode: true }
    });
    return user?.preferredAIStyleMode || "Smart";
  }).catch(() => "Smart");
}

/**
 * Updates user preferred AI Style Mode.
 */
export async function updateAIStyleModePreference(mode: string) {
  return protectedAction(async function updateAiMode(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { preferredAIStyleMode: mode }
    });

    await revalidateDashboard();
    return { success: true };
  });
}
