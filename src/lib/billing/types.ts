import { BillingStatus } from "@prisma/client";

export type BillingProviderType = 'gemini' | 'openai' | 'anthropic';

export interface BillingProvider {
  readonly name: BillingProviderType;
  getMonthlySpend(): Promise<number>;
}

export interface GoogleBillingConfig {
  type: 'google';
  serviceAccount: string;
}

export interface MockBillingConfig {
  type: 'mock';
  mockSpend: number;
}

export type BillingConfig = GoogleBillingConfig | MockBillingConfig;

export interface BillingSyncResult {
  provider: BillingProviderType;
  spend: number;
  status: BillingStatus;
  lastSynced: Date;
}

export interface IBillingNotificationService {
  triggerAlert(
    provider: BillingProviderType,
    spend: number,
    threshold: number,
    status: BillingStatus
  ): Promise<void>;
}

export interface EmailOptions {
  to?: string;
  subject: string;
  html: string;
  text?: string;
}
