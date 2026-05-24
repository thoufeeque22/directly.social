import { logger } from "@/lib/core/logger";

export const getMetaPages = async (accessToken: string) => {
  const url = `https://graph.facebook.com/v22.0/me/accounts?fields=instagram_business_account,name,access_token&access_token=${accessToken}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.data || data.data.length === 0) {
    throw new Error("No Facebook Pages found for this user.");
  }

  return data.data;
};

export const pollMetaStatus = async (
  statusUrl: string,
  maxAttempts = 15,
  interval = 10000
) => {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, interval));
    const res = await fetch(statusUrl);
    const data = await res.json();
    logger.info(`[META-POLL] Iteration ${i}:`, JSON.stringify(data));

    const status = data.status_code || data.status?.video_status?.status || data.status?.video_status;
    if (status === "FINISHED" || status === "ready" || status === "upload_complete") {
      return data;
    }

    if (status === "ERROR" || status === "error") {
      throw new Error(`Meta processing failed: ${JSON.stringify(data)}`);
    }
  }
  throw new Error("Meta processing timed out.");
};
