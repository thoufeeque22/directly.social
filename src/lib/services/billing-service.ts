import { BillingStatus } from '@prisma/client';
import { logger } from '@/lib/core/logger';
import { BillingProvider, IBillingNotificationService, BillingProviderType } from '../billing/types';
import { SystemBillingRepository } from '../billing/repository';

export interface BillingThresholdPolicy {
  getThresholds(threshold: number): {
    warning: number;
    critical: number;
  };
}

export class DefaultBillingThresholdPolicy implements BillingThresholdPolicy {
  getThresholds(threshold: number) {
    return {
      warning: threshold * 0.8,
      critical: threshold,
    };
  }
}

export class BillingService {
  constructor(
    private repository: SystemBillingRepository,
    private notificationService: IBillingNotificationService,
    private providers: BillingProvider[],
    private policy: BillingThresholdPolicy = new DefaultBillingThresholdPolicy()
  ) {}

  /**
   * Syncs spend data for all registered providers.
   */
  async syncAll(): Promise<void> {
    logger.info('[BillingService] Starting global billing sync...');
    
    for (const provider of this.providers) {
      try {
        const spend = await provider.getMonthlySpend();
        await this.processSync(provider.name, spend);
      } catch (error) {
        logger.error(`[BillingService] Sync failed for ${provider.name}:`, error);
        await this.repository.upsert({ 
          provider: provider.name, 
          status: 'UNKNOWN', 
          lastSynced: new Date() 
        });
      }
    }

    logger.info('[BillingService] Global billing sync completed.');
  }

  /**
   * Processes the synced spend, updates status, and triggers alerts if needed.
   */
  private async processSync(provider: BillingProviderType, spend: number): Promise<void> {
    const billing = await this.repository.upsert({ 
      provider, 
      currentSpend: spend, 
      lastSynced: new Date() 
    });
    
    const thresholds = this.policy.getThresholds(billing.threshold);
    let status: BillingStatus = 'HEALTHY';
    
    if (spend >= thresholds.critical) {
      status = 'CRITICAL';
    } else if (spend >= thresholds.warning) {
      status = 'WARNING';
    }

    logger.info(`[BillingService] Provider: ${provider}, Spend: $${spend}, Threshold: $${billing.threshold}, Status: ${status}`);

    await this.repository.updateStatus(provider, status);

    if (status !== 'HEALTHY') {
      await this.notificationService.triggerAlert(provider, spend, billing.threshold, status);
    }
  }
}
