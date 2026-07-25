import { inngest } from '../client';
import { prisma } from '@/lib/core/prisma';
import { logger } from '@/lib/core/logger';
import { decryptLinkedInToken } from '@/lib/platforms/linkedin/encrypt';
import { fetchLinkedInProfile } from '@/lib/platforms/linkedin/client';
import { wipeLinkedInData } from '@/lib/platforms/linkedin/wipe';
import { LinkedInTokenRevokedError } from '@/lib/platforms/linkedin/types';

/**
 * (CA-001): Nightly cron job — LinkedIn Token Validator.
 * Pings the LinkedIn profile endpoint for all connected accounts.
 * Any 401 triggers the full data wipe protocol (blueprint §2.2 Active Revocation).
 */
export const linkedInTokenValidator = inngest.createFunction(
  {
    id: 'linkedin-token-validator',
    name: 'LinkedIn Token Validator (Nightly)',
    triggers: [{ cron: '0 2 * * *' }],
  },
  async ({ step }) => {
    const accounts = await step.run('fetch-linkedin-accounts', async () => {
      return prisma.account.findMany({
        where: { provider: 'linkedin' },
        select: { id: true, userId: true, access_token: true },
      });
    });

    logger.info(`[LINKEDIN-VALIDATOR] Validating ${accounts.length} account(s)`);

    for (const account of accounts) {
      await step.run(`validate-account-${account.id}`, async () => {
        if (!account.access_token) {
          await wipeLinkedInData(account.userId, 'token_revoked');
          return;
        }
        try {
          const decrypted = decryptLinkedInToken(account.access_token);
          await fetchLinkedInProfile(decrypted);
        } catch (error: unknown) {
          if (error instanceof LinkedInTokenRevokedError) {
            logger.warn(`[LINKEDIN-VALIDATOR] 401 detected for userId=${account.userId}. Wiping.`);
            await wipeLinkedInData(account.userId, 'token_revoked');
          } else {
            logger.error(`[LINKEDIN-VALIDATOR] Error for userId=${account.userId}:`,
              error instanceof Error ? error.message : String(error));
          }
        }
      });
    }

    return { validated: accounts.length };
  },
);
