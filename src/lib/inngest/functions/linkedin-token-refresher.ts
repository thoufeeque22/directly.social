import { inngest } from '../client';
import { prisma } from '@/lib/core/prisma';
import { logger } from '@/lib/core/logger';
import { decryptLinkedInToken, encryptLinkedInToken } from '@/lib/platforms/linkedin/encrypt';
import { refreshLinkedInToken } from '@/lib/platforms/linkedin/client';

/** Threshold: refresh if access token expires within 7 days. */
const REFRESH_THRESHOLD_SECONDS = 7 * 24 * 60 * 60;

/**
 * (CA-001): Daily background worker — LinkedIn Token Refresher.
 * Proactively refreshes access tokens nearing their 60-day expiry using
 * the 365-day refresh token, minimizing user friction (blueprint §2.4).
 */
export const linkedInTokenRefresher = inngest.createFunction(
  {
    id: 'linkedin-token-refresher',
    name: 'LinkedIn Token Refresher (Daily)',
    triggers: [{ cron: '0 3 * * *' }],
  },
  async ({ step }) => {
    const threshold = Math.floor(Date.now() / 1000) + REFRESH_THRESHOLD_SECONDS;

    const expiringAccounts = await step.run('fetch-expiring-accounts', async () => {
      return prisma.account.findMany({
        where: {
          provider: 'linkedin',
          expires_at: { lt: threshold },
        },
        select: { id: true, userId: true, access_token: true, refresh_token: true },
      });
    });

    logger.info(`[LINKEDIN-REFRESHER] Found ${expiringAccounts.length} account(s) to refresh`);

    for (const account of expiringAccounts) {
      await step.run(`refresh-account-${account.id}`, async () => {
        if (!account.refresh_token) {
          logger.warn(`[LINKEDIN-REFRESHER] No refresh token for accountId=${account.id}`);
          return;
        }

        try {
          const decryptedRefresh = decryptLinkedInToken(account.refresh_token);
          const { accessToken, expiresAt } = await refreshLinkedInToken(decryptedRefresh);
          const encryptedAccess = encryptLinkedInToken(accessToken);

          await prisma.account.update({
            where: { id: account.id },
            data: { access_token: encryptedAccess, expires_at: expiresAt },
          });

          logger.info(`[LINKEDIN-REFRESHER] Refreshed accountId=${account.id}`);
        } catch (error: unknown) {
          logger.error(`[LINKEDIN-REFRESHER] Failed for accountId=${account.id}:`,
            error instanceof Error ? error.message : String(error));
        }
      });
    }

    return { refreshed: expiringAccounts.length };
  },
);
