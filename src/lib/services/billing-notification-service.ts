import { BillingStatus } from "@prisma/client";
import { logger } from "@/lib/core/logger";
import { IBillingNotificationService } from "../billing/types";
import { sendAdminEmail } from "./email-service";

export class BillingNotificationService implements IBillingNotificationService {
  async triggerAlert(
    provider: string,
    spend: number,
    threshold: number,
    status: BillingStatus
  ): Promise<void> {
    try {
      await sendAdminEmail({
        subject: `[Billing Alert] ${provider} status: ${status}`,
        html: `
          <h3>Billing Alert: ${status}</h3>
          <p>The billing status for <strong>${provider}</strong> has reached a ${status} level.</p>
          <ul>
            <li><strong>Current Spend:</strong> $${spend.toFixed(2)}</li>
            <li><strong>Threshold:</strong> $${threshold.toFixed(2)}</li>
            <li><strong>Status:</strong> ${status}</li>
          </ul>
          <p>Please review your ${provider} billing console to ensure uninterrupted service.</p>
        `
      });
      logger.info(`[BillingNotificationService] Alert email sent for ${provider} (${status}).`);
    } catch (error) {
      logger.error(`[BillingNotificationService] Failed to send alert email for ${provider}:`, error);
    }
  }
}

export const billingNotificationService = new BillingNotificationService();
