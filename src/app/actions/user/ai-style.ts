"use server";

import { prisma } from "@/lib/core/prisma";
import { protectedAction, revalidateDashboard } from "@/lib/core/action-utils";

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
