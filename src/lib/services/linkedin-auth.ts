/* eslint-disable @typescript-eslint/no-explicit-any, max-lines, no-restricted-imports */
import { TokenRevokedError } from "@/lib/platforms/linkedin";
import { IAccountRepository } from "@/lib/core/ports/account-repository";
import { ILinkedInApiClient } from "@/lib/core/ports/linkedin-api-client";
import { AccountRevocationService } from "./account-revocation";
import { z } from "zod";

const LinkedInRefreshResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number(),
});

export class LinkedInAuthService {
  constructor(
    private accountRepo: IAccountRepository,
    private revocationService: AccountRevocationService,
    private apiClient: ILinkedInApiClient
  ) {}

  async validateTokens(): Promise<void> {
    const accounts = await this.accountRepo.findByProvider("linkedin");

    for (const account of accounts) {
      if (!account.accessToken) continue;
      try {
        await this.apiClient.getProfile(account.accessToken);
      } catch (error: unknown) {
        if (error instanceof TokenRevokedError) {
          await this.revocationService.handleRevocation(account.id, account.userId, "linkedin", "Nightly validator detected 401 Unauthorized");
        } else {
          console.error("LinkedIn validation failed with non-401 error", error);
          throw error;
        }
      }
    }
  }

  async refreshExpiringTokens(): Promise<void> {
    const expiringAccounts = await this.accountRepo.findExpiring("linkedin", 7 * 24 * 60 * 60);

    for (const account of expiringAccounts) {
      if (!account.refreshToken) continue;
      try {
        const rawData = await this.apiClient.refreshToken(account.refreshToken);
        const data = LinkedInRefreshResponseSchema.parse(rawData);
        await this.accountRepo.updateTokens(account.id, {
          accessToken: data.access_token,
          refreshToken: data.refresh_token || account.refreshToken,
          expiresAt: Math.floor(Date.now() / 1000) + data.expires_in
        });
      } catch (error: unknown) {
        if (error instanceof TokenRevokedError) {
          await this.revocationService.handleRevocation(account.id, account.userId, "linkedin", "Token revoked during refresh");
        } else {
          console.error("Failed to refresh LinkedIn token", error);
        }
      }
    }
  }
}
