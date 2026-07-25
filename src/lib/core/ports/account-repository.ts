export interface DomainAccount {
  id: string;
  userId: string;
  provider: string;
  providerAccountId: string;
  refreshToken: string | null;
  accessToken: string | null;
  expiresAt: number | null;
}

export interface AccountUpdatePayload {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface IAccountRepository {
  getAccount(userId: string, accountId: string): Promise<DomainAccount>;
  deleteAccount(accountId: string): Promise<void>;
  findExpiring(provider: string, thresholdInSeconds: number): Promise<DomainAccount[]>;
  updateTokens(accountId: string, data: AccountUpdatePayload): Promise<void>;
  findByProvider(provider: string): Promise<DomainAccount[]>;
}

export interface ITokenAuditRepository {
  logWipe(userId: string, provider: string, reason: string): Promise<void>;
}
