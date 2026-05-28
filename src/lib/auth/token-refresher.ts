import { prisma } from "@/lib/core/prisma";
import { getPlatformCredentials } from "@/lib/core/credential-provider";
import { logger } from "@/lib/core/logger";
import { refreshGoogleToken } from "./providers/google";
import { refreshTikTokToken } from "./providers/tiktok";

export async function refreshTokenIfNecessary(accountId: string): Promise<boolean> {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) return false;

  if (!account.refresh_token && account.provider !== "facebook" && account.provider !== "instagram") return false;

  const now = Math.floor(Date.now() / 1000);
  if (account.expires_at && account.expires_at > now + 15 * 60) return false; // 15 mins buffer

  logger.info(`[TOKEN-REFRESHER] Refreshing ${account.provider} account: ${account.id}`);

  try {
    const creds = await getPlatformCredentials(account.userId, account.provider);
    let tokenData = null;

    if (account.provider === "google" && account.refresh_token) {
      tokenData = await refreshGoogleToken(account.refresh_token, creds);
    } else if (account.provider === "tiktok" && account.refresh_token) {
      tokenData = await refreshTikTokToken(account.refresh_token, creds);
    }
    
    if (tokenData) {
      await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || account.refresh_token,
          expires_at: tokenData.expires_at,
        },
      });
      return true;
    }
  } catch (error: unknown) {
    logger.error(`[TOKEN-REFRESHER] Error:`, error instanceof Error ? error.message : String(error));
  }
  return true;
}
