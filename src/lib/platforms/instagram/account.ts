import { getPlatformAccount } from "@/lib/core/platforms/account-utils";
import { getMetaPages } from "@/lib/core/platforms/meta-utils";

export const getInstagramAccount = async (userId: string, accountId?: string) => {
  const account = await getPlatformAccount(userId, "facebook", accountId);
  const pages = await getMetaPages(account.access_token!);

  const pageWithIg = pages.find((p: { instagram_business_account?: { id: string } }) => p.instagram_business_account);
  if (!pageWithIg) {
    throw new Error("No Instagram Business account linked to your Facebook Pages.");
  }

  return {
    igUserId: pageWithIg.instagram_business_account.id,
    userAccessToken: account.access_token!,
  };
};
