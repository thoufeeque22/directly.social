"use server";

import { prisma } from "@/lib/core/prisma";
import { protectedAction, revalidateDashboard } from "@/lib/core/action-utils";

/**
 * Fetches all connected accounts for the current authenticated user.
 */
export async function getUserAccounts() {
  return protectedAction(async function fetchUserAccounts(userId) {
    if (process.env.NEXT_PUBLIC_E2E === 'true') {
       return [
         { id: 'mock-youtube-acc', provider: 'google', accountName: 'Mock YouTube Channel', isDistributionEnabled: true },
         { id: 'mock-facebook-acc', provider: 'facebook', accountName: 'Mock Facebook Page', isDistributionEnabled: true },
         { id: 'mock-tiktok-acc', provider: 'tiktok', accountName: 'Mock TikTok Account', isDistributionEnabled: true }
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
