import { 
  PlatformActivity, 
  VerificationParams, 
  InitiationParams, 
  PushParams, 
  PollingParams, 
  FinalizationParams 
} from "./types";
import { verifyLinkedInProfile, createLinkedInPost, TokenRevokedError } from "./linkedin";
import { IAccountRepository, PrismaAccountRepository } from "@/lib/services/account-repository";
import { randomUUID } from "crypto";

export class LinkedInActivity implements PlatformActivity {
  constructor(private accountRepo: IAccountRepository = new PrismaAccountRepository()) {}

  private async handleRevocation(error: unknown, accountId: string, userId: string) {
    if (error instanceof TokenRevokedError) {
      await this.accountRepo.deleteAccount(accountId);
      await this.accountRepo.logWipe(userId, "linkedin", "Token revoked during activity");
    }
    throw error;
  }

  async preVerify(params: VerificationParams): Promise<void> {
    const account = await this.accountRepo.getAccount(params.userId, params.accountId);
    try {
      await verifyLinkedInProfile(account.access_token!);
    } catch (error) {
      await this.handleRevocation(error, params.accountId, params.userId);
    }
  }

  async init(params: InitiationParams): Promise<{ creationId: string; resumableUrl: string }> {
    return { creationId: randomUUID(), resumableUrl: "" };
  }

  async push(params: PushParams): Promise<{ resumableUrl?: string; platformPostId?: string }> {
    const account = await this.accountRepo.getAccount(params.userId, params.accountId);
    try {
      const res = await createLinkedInPost(
        account.access_token!,
        account.providerAccountId,
        params.title || params.description || ""
      );
      return { platformPostId: res.id };
    } catch (error) {
      await this.handleRevocation(error, params.accountId, params.userId);
      throw error; // this is already thrown inside handleRevocation, but TS needs it
    }
  }

  async poll(params: PollingParams): Promise<void> {}

  async finalize(params: FinalizationParams): Promise<{ id: string; permalink: string }> {
    return { id: params.creationId, permalink: `https://www.linkedin.com/feed/update/${params.creationId}` };
  }
}
