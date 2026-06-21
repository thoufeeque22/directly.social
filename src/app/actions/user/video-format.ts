"use server";

import { prisma } from "@/lib/core/prisma";
import { protectedAction, revalidateDashboard } from "@/lib/core/action-utils";

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
