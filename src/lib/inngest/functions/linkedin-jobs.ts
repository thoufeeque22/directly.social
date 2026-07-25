import { inngest } from "../client";
import { LinkedInAuthService } from "@/lib/services/linkedin-auth";
import { PrismaAccountRepository } from "@/lib/services/account-repository";

const linkedInAuthService = new LinkedInAuthService(new PrismaAccountRepository());

export const linkedInTokenValidator = inngest.createFunction(
  { id: "linkedin-token-validator", name: "LinkedIn Token Validator" },
  { cron: "0 0 * * *" }, // Nightly
  async ({ step }) => {
    await step.run("validate-linkedin-tokens", async () => {
      await linkedInAuthService.validateTokens();
    });
  }
);

export const linkedInTokenRefresher = inngest.createFunction(
  { id: "linkedin-token-refresher", name: "LinkedIn Token Refresher" },
  { cron: "0 1 * * *" }, // Daily at 1 AM
  async ({ step }) => {
    await step.run("refresh-linkedin-tokens", async () => {
      await linkedInAuthService.refreshExpiringTokens();
    });
  }
);
