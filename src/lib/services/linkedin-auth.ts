import { verifyLinkedInProfile, TokenRevokedError } from "@/lib/platforms/linkedin";
import { IAccountRepository } from "./account-repository";
import { z } from "zod";

const LinkedInRefreshResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number(),
});

export class LinkedInAuthService {
  constructor(private accountRepo: IAccountRepository) {}

  async validateTokens(): Promise<void> {
    const accounts = await this.accountRepo.findByProvider("linkedin");

    for (const account of accounts) {
      if (!account.access_token) continue;
      try {
        await verifyLinkedInProfile(account.access_token);
      } catch (error: unknown) {
        if (error instanceof TokenRevokedError) {
          await this.accountRepo.deleteAccount(account.id);
          await this.accountRepo.logWipe(account.userId, "linkedin", "Nightly validator detected 401 Unauthorized");
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
      if (!account.refresh_token) continue;
      const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: account.refresh_token,
          client_id: process.env.AUTH_LINKEDIN_ID || "",
          client_secret: process.env.AUTH_LINKEDIN_SECRET || ""
        })
      });

      if (res.ok) {
        const rawData = await res.json();
        const data = LinkedInRefreshResponseSchema.parse(rawData);
        await this.accountRepo.updateTokens(account.id, {
          access_token: data.access_token,
          refresh_token: data.refresh_token || account.refresh_token,
          expires_at: Math.floor(Date.now() / 1000) + data.expires_in
        });
      }
    }
  }
}
