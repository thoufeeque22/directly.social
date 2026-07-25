import { 
  PlatformActivity, 
  VerificationParams, 
  InitiationParams, 
  PushParams,
  FinalizationParams 
} from "./types";
import { TokenRevokedError } from "./linkedin";
import { IAccountRepository } from "@/lib/core/ports/account-repository";
import { ILinkedInApiClient } from "@/lib/core/ports/linkedin-api-client";
import { AccountRevocationService } from "@/lib/services/account-revocation";
import { randomUUID } from "crypto";

export class AccountNotConnectedError extends Error {
  constructor(message: string = "Account is not connected properly.") {
    super(message);
    this.name = "AccountNotConnectedError";
  }
}

export class LinkedInActivity implements PlatformActivity {
  constructor(
    private accountRepo: IAccountRepository,
    private revocationService: AccountRevocationService,
    private apiClient: ILinkedInApiClient
  ) {}

  private async handleRevocation(error: unknown, accountId: string, userId: string) {
    if (error instanceof TokenRevokedError) {
      await this.revocationService.handleRevocation(accountId, userId, "linkedin", "Token revoked during activity");
    }
    throw error;
  }

  async preVerify(params: VerificationParams): Promise<void> {
    const account = await this.accountRepo.getAccount(params.userId, params.accountId);
    if (!account.accessToken) throw new AccountNotConnectedError();
    try {
      await this.apiClient.getProfile(account.accessToken);
    } catch (error) {
      await this.handleRevocation(error, params.accountId, params.userId);
    }
  }

  async init(params: InitiationParams): Promise<{ creationId: string; resumableUrl: string }> {
    return { creationId: randomUUID(), resumableUrl: "" };
  }

  async push(params: PushParams): Promise<{ resumableUrl?: string; platformPostId?: string }> {
    const account = await this.accountRepo.getAccount(params.userId, params.accountId);
    if (!account.accessToken) throw new AccountNotConnectedError();
    try {
      const res = await this.apiClient.createPost(
        account.accessToken,
        account.providerAccountId,
        params.content.title || params.content.description || ""
      );
      return { platformPostId: res.id };
    } catch (error) {
      await this.handleRevocation(error, params.accountId, params.userId);
      throw error;
    }
  }

  async finalize(params: FinalizationParams): Promise<{ id: string; permalink: string }> {
    return { id: params.creationId, permalink: `https://www.linkedin.com/feed/update/${params.creationId}` };
  }
}
