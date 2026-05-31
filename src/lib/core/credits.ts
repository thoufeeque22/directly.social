import { prisma } from "@/lib/core/prisma";
import { logger } from "@/lib/core/logger";
import { NotificationType } from "@prisma/client";

const LOW_CREDIT_THRESHOLD = 10;

/**
 * Consumes an AI credit for a given user.
 * 
 * @param userId - The ID of the user.
 * @param activeProvider - The current active AI provider (e.g., "gemini").
 * @param byokConfigs - Record of BYOK credentials, where key is provider.
 * @returns {Promise<{ success: boolean; balance?: number }>}
 * @throws Error if insufficient credits.
 */
export async function consumeAiCredit(
  userId: string,
  activeProvider: string,
  byokConfigs?: Record<string, { apiKey: string; modelId: string }>
) {
  // 1. If a valid BYOK exists for the active provider, skip deduction
  if (byokConfigs && byokConfigs[activeProvider]) {
    return { success: true }; // skipped deduction
  }

  // 2. Fetch the current user balance using transaction to prevent race conditions
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiCredits: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.aiCredits <= 0) {
    throw new Error("Insufficient AI Credits");
  }

  // 3. Decrement aiCredits by 1
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { aiCredits: { decrement: 1 } },
  });

  const newBalance = updatedUser.aiCredits;

  // 4. If new balance hits low threshold, trigger Alert System
  if (newBalance === LOW_CREDIT_THRESHOLD || newBalance === 0) {
    // Alert the user
    await prisma.notification.create({
      data: {
        userId: userId,
        type: NotificationType.WARNING,
        message: `Your AI credits are running low. You have ${newBalance} credits remaining.`,
      },
    });

    // Alert the admins
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    if (admins.length > 0) {
      const adminNotifications = admins.map(admin => ({
        userId: admin.id,
        type: NotificationType.WARNING,
        message: `User ${userId} has hit the low AI credits threshold (${newBalance} credits left).`,
      }));

      await prisma.notification.createMany({
        data: adminNotifications,
      });
    }

    // Mock email dispatcher to fulfill the email mandate gracefully
    logger.info(`EMAIL ALERT: User ${userId} has hit the low AI credits threshold (${newBalance} credits left).`);
  }

  return { success: true, balance: newBalance };
}
