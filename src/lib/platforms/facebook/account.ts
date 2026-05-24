import { getPlatformAccount } from "@/lib/core/platforms/account-utils";
import { getMetaPages } from "@/lib/core/platforms/meta-utils";

export const getFacebookPageAccount = async (userId: string, accountId?: string) => {
  const account = await getPlatformAccount(userId, "facebook", accountId);
  const pages = await getMetaPages(account.access_token!);

  // By default, take the first page
  const targetPage = pages[0];

  return {
    pageId: targetPage.id,
    pageAccessToken: targetPage.access_token,
    pageName: targetPage.name,
  };
};
