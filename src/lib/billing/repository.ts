import { BillingStatus, SystemBilling } from "@prisma/client";
import { prisma } from "@/lib/core/prisma";

export interface SystemBillingRepository {
  getAll(): Promise<SystemBilling[]>;
  findByProvider(provider: string): Promise<SystemBilling | null>;
  upsert(data: Partial<SystemBilling> & { provider: string }): Promise<SystemBilling>;
  updateStatus(provider: string, status: BillingStatus): Promise<void>;
}

export class PrismaSystemBillingRepository implements SystemBillingRepository {
  async getAll() {
    return prisma.systemBilling.findMany({ orderBy: { provider: "asc" } });
  }

  async findByProvider(provider: string) {
    return prisma.systemBilling.findUnique({ where: { provider } });
  }

  async upsert(data: Partial<SystemBilling> & { provider: string }) {
    return prisma.systemBilling.upsert({
      where: { provider: data.provider },
      update: { 
        currentSpend: data.currentSpend ?? undefined, 
        lastSynced: data.lastSynced || new Date(),
        status: data.status 
      },
      create: { 
        provider: data.provider, 
        currentSpend: data.currentSpend || 0, 
        threshold: data.threshold || 10.0,
        status: data.status || "HEALTHY"
      }
    });
  }

  async updateStatus(provider: string, status: BillingStatus) {
    await prisma.systemBilling.update({ where: { provider }, data: { status } });
  }
}

export const billingRepository = new PrismaSystemBillingRepository();
