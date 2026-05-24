import { getPlatformAccount } from "@/lib/core/platforms/account-utils";

export const getTikTokAccount = async (userId: string, accountId?: string) => {
  return await getPlatformAccount(userId, "tiktok", accountId);
};
