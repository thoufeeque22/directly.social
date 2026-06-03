import { BillingService } from "./billing-service";
import { billingRepository } from "../billing/repository";
import { billingNotificationService } from "./billing-notification-service";
import { GoogleBillingProvider } from "../billing/google-provider";
import { MockBillingProvider } from "../billing/mock-provider";
import { BillingProvider } from "../billing/types";

/**
 * Composition Root for Billing.
 * Located in services to avoid dependency cycle with lib/billing. (CA-001)
 */
function createProviders(): BillingProvider[] {
  const providers: BillingProvider[] = [];

  // Google / Gemini
  const googleMockSpend = process.env.GOOGLE_BILLING_MOCK_SPEND;
  
  if (googleMockSpend !== undefined) {
    providers.push(new MockBillingProvider('gemini', { 
      type: 'mock',
      mockSpend: parseFloat(googleMockSpend) 
    }));
  } else {
    const serviceAccount = process.env.GOOGLE_BILLING_SERVICE_ACCOUNT;
    if (serviceAccount) {
      providers.push(new GoogleBillingProvider({
        type: 'google',
        serviceAccount,
      }));
    }
  }

  return providers;
}

export const billingService = new BillingService(
  billingRepository,
  billingNotificationService,
  createProviders()
);
