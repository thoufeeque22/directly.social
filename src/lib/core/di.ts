import { PrismaAccountRepository, PrismaTokenAuditRepository } from "@/lib/infrastructure/account-repository";
import { AccountRevocationService } from "@/lib/services/account-revocation";
import { LinkedInApiClient } from "@/lib/platforms/linkedin";
import { LinkedInAuthService } from "@/lib/services/linkedin-auth";
import { LinkedInActivity } from "@/lib/platforms/linkedin-activity";

const accountRepo = new PrismaAccountRepository();
const auditRepo = new PrismaTokenAuditRepository();
const revocationService = new AccountRevocationService(accountRepo, auditRepo);
const linkedInApiClient = new LinkedInApiClient();

export const di = {
  accountRepo,
  auditRepo,
  revocationService,
  linkedInApiClient,
  linkedInAuthService: new LinkedInAuthService(accountRepo, revocationService, linkedInApiClient),
  linkedInActivity: new LinkedInActivity(accountRepo, revocationService, linkedInApiClient)
};
