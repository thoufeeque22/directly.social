"use server";

import { prisma } from "@/lib/core/prisma";
import { Theme } from "@prisma/client";
import { protectedAction, revalidateDashboard } from "@/lib/core/action-utils";

/**
 * Fetches user theme preference.
 */
export async function getThemePreference() {
  return protectedAction(async function fetchTheme(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferredTheme: true }
    });
    return (user?.preferredTheme as Theme) || Theme.SYSTEM;
  }).catch(() => Theme.SYSTEM);
}

/**
 * Updates user theme preference.
 */
export async function updateThemePreference(theme: Theme) {
  return protectedAction(async function updateTheme(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { preferredTheme: theme }
    });

    await revalidateDashboard();
    return { success: true };
  });
}
