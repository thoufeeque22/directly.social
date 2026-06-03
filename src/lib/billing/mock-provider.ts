import { BillingProvider, MockBillingConfig, BillingProviderType } from './types';
import { logger } from '@/lib/core/logger';

/**
 * Mock provider for testing and demonstration.
 */
export class MockBillingProvider implements BillingProvider {
  constructor(
    readonly name: BillingProviderType,
    private config: MockBillingConfig
  ) {
    if (config.mockSpend === undefined || config.mockSpend < 0) {
      throw new Error('[MockBillingProvider] mockSpend must be a non-negative number');
    }
  }

  async getMonthlySpend(): Promise<number> {
    const spend = this.config.mockSpend;
    logger.info(`[MockBillingProvider] ${this.name} Returning mock spend: $${spend}`);
    return spend;
  }
}
