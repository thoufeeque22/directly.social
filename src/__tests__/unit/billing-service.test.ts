import { describe, it, expect, vi, beforeEach } from "vitest";
import { BillingService } from "../../lib/services/billing-service";

import { SystemBillingRepository } from "../../lib/billing/repository";
import { IBillingNotificationService, BillingProvider } from "../../lib/billing/types";

// Mock dependencies
const mockRepository = {
  getAll: vi.fn(),
  findByProvider: vi.fn(),
  upsert: vi.fn(),
  updateStatus: vi.fn(),
} as unknown as SystemBillingRepository;

const mockProvider = {
  name: "gemini",
  getMonthlySpend: vi.fn(),
} as unknown as BillingProvider;

const mockNotificationService = {
  triggerAlert: vi.fn(),
} as unknown as IBillingNotificationService;

vi.mock("@/lib/core/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("BillingService", () => {
  let billingService: BillingService;

  beforeEach(() => {
    vi.clearAllMocks();
    billingService = new BillingService(
      mockRepository, 
      mockNotificationService,
      [mockProvider]
    );
  });

  it("should process sync and set status to HEALTHY when spend is below threshold", async () => {
    vi.mocked(mockProvider.getMonthlySpend).mockResolvedValue(5.0);
    vi.mocked(mockRepository.upsert).mockResolvedValue({ 
      provider: "gemini", 
      threshold: 10.0,
      currentSpend: 5.0
    } as unknown as ReturnType<typeof mockRepository.upsert> extends Promise<infer T> ? T : never);

    await billingService.syncAll();

    expect(mockRepository.upsert).toHaveBeenCalledWith(expect.objectContaining({
      provider: "gemini",
      currentSpend: 5.0,
    }));
    expect(mockRepository.updateStatus).toHaveBeenCalledWith("gemini", "HEALTHY");
    expect(mockNotificationService.triggerAlert).not.toHaveBeenCalled();
  });

  it("should set status to WARNING and trigger alert when spend is >= 80% of threshold", async () => {
    vi.mocked(mockProvider.getMonthlySpend).mockResolvedValue(8.5);
    vi.mocked(mockRepository.upsert).mockResolvedValue({ 
      provider: "gemini", 
      threshold: 10.0,
      currentSpend: 8.5
    } as unknown as ReturnType<typeof mockRepository.upsert> extends Promise<infer T> ? T : never);

    await billingService.syncAll();

    expect(mockRepository.updateStatus).toHaveBeenCalledWith("gemini", "WARNING");
    expect(mockNotificationService.triggerAlert).toHaveBeenCalledWith(
      "gemini", 
      8.5, 
      10.0, 
      "WARNING"
    );
  });

  it("should set status to CRITICAL and trigger alert when spend is >= threshold", async () => {
    vi.mocked(mockProvider.getMonthlySpend).mockResolvedValue(12.0);
    vi.mocked(mockRepository.upsert).mockResolvedValue({ 
      provider: "gemini", 
      threshold: 10.0,
      currentSpend: 12.0
    } as unknown as ReturnType<typeof mockRepository.upsert> extends Promise<infer T> ? T : never);

    await billingService.syncAll();

    expect(mockRepository.updateStatus).toHaveBeenCalledWith("gemini", "CRITICAL");
    expect(mockNotificationService.triggerAlert).toHaveBeenCalledWith(
      "gemini", 
      12.0, 
      10.0, 
      "CRITICAL"
    );
  });

  it("should handle provider failure and set status to UNKNOWN", async () => {
    vi.mocked(mockProvider.getMonthlySpend).mockRejectedValue(new Error("API Error"));

    await billingService.syncAll();

    expect(mockRepository.upsert).toHaveBeenCalledWith(expect.objectContaining({
      provider: "gemini",
      status: "UNKNOWN",
    }));
  });

  it("should handle multiple providers", async () => {
    const mockProvider2 = {
      name: "openai",
      getMonthlySpend: vi.fn().mockResolvedValue(2.0),
    } as unknown as BillingProvider;
    
    const serviceWithTwoProviders = new BillingService(
      mockRepository,
      mockNotificationService,
      [mockProvider, mockProvider2]
    );

    vi.mocked(mockProvider.getMonthlySpend).mockResolvedValue(5.0);
    vi.mocked(mockRepository.upsert).mockResolvedValue({ 
      provider: "gemini", 
      threshold: 10.0 
    } as unknown as ReturnType<typeof mockRepository.upsert> extends Promise<infer T> ? T : never);

    await serviceWithTwoProviders.syncAll();

    expect(mockProvider.getMonthlySpend).toHaveBeenCalled();
    expect(vi.mocked(mockProvider2.getMonthlySpend)).toHaveBeenCalled();
    expect(mockRepository.upsert).toHaveBeenCalledTimes(2);
  });
});
