import { IAccountRepository, ITokenAuditRepository } from "@/lib/core/ports/account-repository";

export class AccountRevocationService {
  constructor(
    private accountRepo: IAccountRepository,
    private auditRepo: ITokenAuditRepository
  ) {}

  async handleRevocation(accountId: string, userId: string, provider: string, reason: string): Promise<void> {
    await this.accountRepo.deleteAccount(accountId);
    await this.auditRepo.logWipe(userId, provider, reason);
  }
}
