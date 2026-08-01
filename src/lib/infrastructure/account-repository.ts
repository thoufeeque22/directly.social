import { prisma } from "@/lib/infrastructure/database/prisma";
import { Account } from "@prisma/client";
import { IAccountRepository, ITokenAuditRepository, DomainAccount, AccountUpdatePayload } from "@/lib/core/ports/account-repository";

function mapToDomainAccount(account: Account): DomainAccount {
  return {
    id: account.id,
    userId: account.userId,
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    refreshToken: account.refresh_token,
    accessToken: account.access_token,
    expiresAt: account.expires_at,
  };
}

export class PrismaAccountRepository implements IAccountRepository {
  async getAccount(userId: string, accountId: string): Promise<DomainAccount> {
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account || account.userId !== userId) throw new Error("Account not found");
    return mapToDomainAccount(account);
  }
  async deleteAccount(accountId: string): Promise<void> {
    await prisma.account.delete({ where: { id: accountId } });
  }
  async findExpiring(provider: string, thresholdInSeconds: number): Promise<DomainAccount[]> {
    const accounts = await prisma.account.findMany({
      where: { provider, expires_at: { lt: Math.floor(Date.now() / 1000) + thresholdInSeconds } }
    });
    return accounts.map(mapToDomainAccount);
  }
  async updateTokens(accountId: string, data: AccountUpdatePayload): Promise<void> {
    await prisma.account.update({ 
      where: { id: accountId }, 
      data: {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        expires_at: data.expiresAt
      } 
    });
  }
  async findByProvider(provider: string): Promise<DomainAccount[]> {
    const accounts = await prisma.account.findMany({ where: { provider } });
    return accounts.map(mapToDomainAccount);
  }
}

export class PrismaTokenAuditRepository implements ITokenAuditRepository {
  async logWipe(userId: string, provider: string, reason: string): Promise<void> {
    await prisma.tokenAuditLog.create({
      data: { userId, action: "WIPE", provider, reason }
    });
  }
}
