"use server";

import { prisma } from "@/lib/core/prisma";
import { protectedAction, revalidateDashboard } from "@/lib/core/action-utils";

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
