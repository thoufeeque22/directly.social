import { promises as fs } from "fs";
import { getYouTubeClient } from "./youtube/account";
import { initYouTubeSession } from "./youtube/session";
import { pushYouTubeBinary } from "./youtube/push";
import { PublishParams } from "@/lib/core/platforms/types";
import { logger } from "@/lib/core/logger";

export { getYouTubeClient };

export const uploadToYouTube = async ({
  userId, filePath, title, description, accountId, resumableUrl, onProgress, privacy = "private"
}: PublishParams & { resumableUrl?: string; privacy?: string }) => {
  const youtube = await getYouTubeClient(userId, accountId);
  const { size: fileSize } = await fs.stat(filePath);
  
  let uploadUrl = resumableUrl;
  let startByte = 0;

  if (resumableUrl) {
    logger.info(`[YT-UPLOAD] Resuming session: ${resumableUrl}`);
    const offsetRes = await fetch(resumableUrl, {
      method: "PUT",
      headers: { "Content-Range": `bytes */${fileSize}` },
    });

    if (offsetRes.status === 308) {
      const range = offsetRes.headers.get("Range");
      if (range) {
        startByte = parseInt(range.split("-")[1]) + 1;
      }
    } else if (offsetRes.ok) {
      return { data: await offsetRes.json(), resumableUrl };
    } else {
      logger.warn(`[YT-UPLOAD] Session expired, starting fresh.`);
      uploadUrl = undefined;
    }
  }

  if (!uploadUrl) {
    uploadUrl = await initYouTubeSession(youtube, fileSize, {
      snippet: { title, description, tags: ["Directly"], categoryId: "22" },
      status: { privacyStatus: privacy, selfDeclaredMadeForKids: false },
    });
  }

  const result = await pushYouTubeBinary(uploadUrl, filePath, startByte, fileSize, onProgress);
  return { data: result, resumableUrl: uploadUrl };
};

export const getYouTubeStats = async (userId: string, accountId?: string) => {
  const youtube = await getYouTubeClient(userId, accountId);
  const res = await youtube.channels.list({ part: ["statistics"], mine: true });
  const stats = res.data.items?.[0]?.statistics;
  return stats ? { views: parseInt(stats.viewCount || "0"), subscribers: parseInt(stats.subscriberCount || "0"), videos: parseInt(stats.videoCount || "0") } : null;
};
