import { prisma } from "@/lib/core/prisma";
import { logTokenEvent } from "@/lib/core/audit";

export const getPlatformAccount = async (
  userId: string,
  provider: string,
  accountId?: string
) => {
  const account = accountId
    ? await prisma.account.findUnique({ where: { id: accountId, userId } })
    : await prisma.account.findFirst({ where: { userId, provider } });

  if (!account || !account.access_token) {
    throw new Error(`Specified ${provider} account not found.`);
  }

  await logTokenEvent({
    userId,
    accountId: account.id,
    action: "ACCESS",
    provider,
    reason: `Initializing ${provider} client`
  });

  return account;
};
