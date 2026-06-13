import { prisma } from "@/lib/core/prisma";
import { logger } from "@/lib/core/logger";
import { PlatformRevocationUtility } from "@/lib/platforms/revoke";
import { EmailService } from "./email-service";
import { PrivacyExportHelper } from "./privacy-export";

export class PrivacyService {
  private revoker = new PlatformRevocationUtility();
  private emailService = new EmailService();

  /**
   * Requests a data export for a user.
   */
  async requestDataExport(userId: string): Promise<void> {
    try {
      const exportData = await PrivacyExportHelper.getExportData(userId);

      logger.info(`[PRIVACY_EXPORT] Data export prepared for user ${userId}`);
      
      if (exportData.user.email) {
        await this.emailService.sendDataExportEmail(
          exportData.user.email, 
          JSON.stringify(exportData, null, 2)
        );
      }
    } catch (error) {
      logger.error(`[PRIVACY_EXPORT] Failed to request data export for user ${userId}: ${error}`);
      throw error;
    }
  }

  /**
   * Executes full account deletion.
   */
  async executeAccountDeletion(userId: string): Promise<void> {
    try {
      const accounts = await prisma.account.findMany({
        where: { userId },
      });

      // Step 1: Best-effort token revocation
      for (const account of accounts) {
        if (!account.access_token) continue;

        if (account.provider === "google") {
          await this.revoker.revokeGoogle(account.access_token);
        } else if (account.provider === "tiktok") {
          await this.revoker.revokeTikTok(account.access_token);
        } else if (account.provider === "facebook") {
          await this.revoker.revokeFacebook(account.access_token);
        }
      }

      logger.info(`[PRIVACY_DELETE] Revocation and asset cleanup simulated for user ${userId}`);

      // Step 3: Purge DB records (Prisma cascade delete)
      await prisma.user.delete({
        where: { id: userId },
      });

      logger.info(`[PRIVACY_DELETE] Account purged for user ${userId}`);
    } catch (error) {
      logger.error(`[PRIVACY_DELETE] Failed to delete account for user ${userId}: ${error}`);
      throw error;
    }
  }
}
