
import { BillingProvider, GoogleBillingConfig, BillingProviderType } from './types';
import { logger } from '@/lib/core/logger';

/**
 * Provider for Google Cloud Billing / AI Studio.
 * 
 * NOTE: The Google Cloud Billing API (Cloud Billing Budgets API) does not provide
 * granular, real-time spend data directly via a simple 'get current spend' call.
 * For production, it is recommended to set up a BigQuery billing export and query
 * that for real-time data.
 */
export class GoogleBillingProvider implements BillingProvider {
  readonly name: BillingProviderType = 'gemini';

  constructor(private config: GoogleBillingConfig) {
    if (!config.serviceAccount) {
      throw new Error('[GoogleBillingProvider] Missing serviceAccount configuration');
    }
    
    // Validate that it is valid JSON
    try {
      JSON.parse(config.serviceAccount);
    } catch {
      throw new Error('[GoogleBillingProvider] serviceAccount must be a valid JSON string');
    }
  }

  async getMonthlySpend(): Promise<number> {
    /**
     * NOTE: Real-time spend fetching is not implemented as it requires BigQuery integration.
     * Returning 0.0 was previously found to be a violation of LSP.
     * Throwing an error ensures the BillingService knows this provider cannot provide data.
     */
    const errorMsg = '[GoogleBillingProvider] Real-time spend fetching is not implemented (requires BigQuery export).';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}
