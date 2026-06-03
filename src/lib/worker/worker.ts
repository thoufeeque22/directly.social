import { prisma } from "@/lib/core/prisma";
import * as Sentry from "@sentry/nextjs";
import { logger } from "@/lib/core/logger";
import { AuditService } from "@/lib/services/audit-service";
import { purgeExpiredAssets } from "./tasks/cleanup";
import { processPendingPosts } from "./tasks/publisher";

declare global {
  var _ss_worker_started: boolean | undefined;
  var _ss_worker_interval: NodeJS.Timeout | undefined;
  var _ss_cleanup_interval: NodeJS.Timeout | undefined;
  var _ss_audit_interval: NodeJS.Timeout | undefined;
  var _ss_billing_interval: NodeJS.Timeout | undefined;
  var _ss_worker_version: number | undefined;
}

export async function startPublishingWorker() {
  const currentVersion = Date.now();
  
  if (global._ss_worker_started) {
    logger.info("♻️ [WORKER] Restarting worker...");
    [global._ss_worker_interval, global._ss_cleanup_interval, global._ss_audit_interval, global._ss_billing_interval]
      .forEach(i => i && clearInterval(i));
  }
  
  global._ss_worker_started = true;
  global._ss_worker_version = currentVersion;
  logger.info("👷 [WORKER] Scheduled Publishing Worker Started...");

  // Publisher Interval (10s)
  global._ss_worker_interval = setInterval(async () => {
    if (global._ss_worker_version !== currentVersion) return;
    await processPendingPosts().catch(err => logger.error("👷 [WORKER] Polling failed:", err));
  }, 10000);

  // Cleanup Interval (1h)
  global._ss_cleanup_interval = setInterval(async () => {
    if (global._ss_worker_version !== currentVersion) return;
    await purgeExpiredAssets();
  }, 60 * 60 * 1000);

  // Audit Interval (12h)
  global._ss_audit_interval = setInterval(async () => {
    if (global._ss_worker_version !== currentVersion) return;
    await AuditService.runFullAudit().catch(err => logger.error("🕵️ [WORKER] Audit failed:", err));
  }, 12 * 60 * 60 * 1000);

  // Billing Sync Interval (4h)
  global._ss_billing_interval = setInterval(async () => {
    if (global._ss_worker_version !== currentVersion) return;
    const { billingService } = await import('@/lib/services/billing-instance');
    await billingService.syncAll().catch(err => logger.error("💰 [WORKER] Billing sync failed:", err));
  }, 4 * 60 * 60 * 1000);

  // Initial runs
  purgeExpiredAssets();
  AuditService.runFullAudit().catch(() => {});
  import('@/lib/services/billing-instance').then(m => m.billingService.syncAll()).catch(() => {});
}
