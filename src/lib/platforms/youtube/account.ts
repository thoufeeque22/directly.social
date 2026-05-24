import { google } from "googleapis";
import { prisma } from "@/lib/core/prisma";
import { getPlatformAccount } from "@/lib/core/platforms/account-utils";
import { getPlatformCredentials } from "@/lib/core/credential-provider";

export const getYouTubeClient = async (userId: string, accountId?: string) => {
  const account = await getPlatformAccount(userId, "google", accountId);
  const credentials = await getPlatformCredentials(userId, "google");

  const auth = new google.auth.OAuth2(
    credentials.clientId, credentials.clientSecret, credentials.redirectUri
  );

  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  auth.on("tokens", async (tokens) => {
    const data: { access_token?: string; refresh_token?: string; expires_at?: number } = { access_token: tokens.access_token ?? undefined };
    if (tokens.refresh_token) data.refresh_token = tokens.refresh_token;
    if (tokens.expiry_date) data.expires_at = Math.floor(tokens.expiry_date / 1000);
    await prisma.account.update({ where: { id: account.id }, data });
  });

  return google.youtube({ version: "v3", auth });
};
