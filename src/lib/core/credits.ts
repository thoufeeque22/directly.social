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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _activeProvider: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _byokConfigs?: Record<string, { apiKey: string; modelId: string }>
) {
  // Feature temporarily disabled.
  return { success: true };
  
  /*
  if (byokConfigs && byokConfigs[activeProvider]) {
    return { success: true };
  }
  */

  // Use updateMany for atomic decrement with condition
  const result = await prisma.user.updateMany({
    where: { 
      id: userId,
      aiCredits: { gt: 0 }
    },
    data: { aiCredits: { decrement: 1 } },
  });

  if (result.count === 0) {
    // Determine if it was user not found or insufficient credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { aiCredits: true },
    });

    if (!user) {
      throw new Error("User not found");
    }
    throw new Error("Insufficient AI Credits");
  }

  // Fetch the new balance after successful decrement
  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiCredits: true },
  });

  if (!updatedUser) {
    throw new Error("User not found after update");
  }

  const newBalance = updatedUser!.aiCredits;

  if (newBalance === LOW_CREDIT_THRESHOLD || newBalance === 0) {
    await prisma.notification.create({
      data: {
        userId: userId,
        type: NotificationType.WARNING,
        message: `Your AI credits are running low. You have ${newBalance} credits remaining.`,
      },
    });

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

    logger.info(`EMAIL ALERT: User ${userId} has hit the low AI credits threshold (${newBalance} credits left).`);
  }

  return { success: true, balance: newBalance };
}
