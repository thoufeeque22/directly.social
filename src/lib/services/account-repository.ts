import { prisma } from "@/lib/core/prisma";

export interface IAccountRepository {
  getAccount(userId: string, accountId: string): Promise<any>;
  deleteAccount(accountId: string): Promise<void>;
  logWipe(userId: string, provider: string, reason: string): Promise<void>;
  findExpiring(provider: string, thresholdInSeconds: number): Promise<any[]>;
  updateTokens(accountId: string, data: any): Promise<void>;
  findByProvider(provider: string): Promise<any[]>;
}

export class PrismaAccountRepository implements IAccountRepository {
  async getAccount(userId: string, accountId: string) {
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account || account.userId !== userId) throw new Error("Account not found");
    return account;
  }
  async deleteAccount(accountId: string) {
    await prisma.account.delete({ where: { id: accountId } });
  }
  async logWipe(userId: string, provider: string, reason: string) {
    await prisma.tokenAuditLog.create({
      data: { userId, action: "WIPE", provider, reason }
    });
  }
  async findExpiring(provider: string, thresholdInSeconds: number) {
    return prisma.account.findMany({
      where: { provider, expires_at: { lt: Math.floor(Date.now() / 1000) + thresholdInSeconds } }
    });
  }
  async updateTokens(accountId: string, data: any) {
    await prisma.account.update({ where: { id: accountId }, data });
  }
  async findByProvider(provider: string) {
    return prisma.account.findMany({ where: { provider } });
  }
}
