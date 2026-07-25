import { prisma } from '@/lib/core/prisma';
import { logger } from '@/lib/core/logger';
import type { LinkedInWipeReason } from './types';

/**
 * (OO-003): Data Wipe Protocol for LinkedIn.
 * Deletes the Account record (and cascaded related data) when a token
 * is detected as revoked via a 401 from LinkedIn's API.
 * Implements the "Passive Revocation" strategy from the blueprint.
 */
export const wipeLinkedInData = async (
  userId: string,
  reason: LinkedInWipeReason,
): Promise<void> => {
  logger.info(`[LINKEDIN-WIPE] Initiating wipe for userId=${userId}, reason=${reason}`);

  await prisma.account.deleteMany({
    where: {
      userId,
      provider: 'linkedin',
    },
  });

  logger.info(`[LINKEDIN-WIPE] Completed wipe for userId=${userId}`);
};

/**
 * Fetches the LinkedIn Account record for a user, if one exists.
 * Returns null if no LinkedIn connection is present.
 */
export const findLinkedInAccount = async (userId: string) => {
  return prisma.account.findFirst({
    where: { userId, provider: 'linkedin' },
    select: {
      id: true,
      access_token: true,
      refresh_token: true,
      expires_at: true,
      scope: true,
    },
  });
};
