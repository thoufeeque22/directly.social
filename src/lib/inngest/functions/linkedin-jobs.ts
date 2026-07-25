import { inngest } from "../client";
import { di } from "@/lib/core/di";

export const linkedInTokenValidator = inngest.createFunction(
  { 
    id: "linkedin-token-validator", 
    name: "LinkedIn Token Validator",
    triggers: [{ cron: "0 0 * * *" }]
  },
  async ({ step }) => {
    await step.run("validate-linkedin-tokens", async () => {
      await di.linkedInAuthService.validateTokens();
    });
  }
);

export const linkedInTokenRefresher = inngest.createFunction(
  { 
    id: "linkedin-token-refresher", 
    name: "LinkedIn Token Refresher",
    triggers: [{ cron: "0 1 * * *" }]
  },
  async ({ step }) => {
    await step.run("refresh-linkedin-tokens", async () => {
      await di.linkedInAuthService.refreshExpiringTokens();
    });
  }
);
