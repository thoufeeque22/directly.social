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
