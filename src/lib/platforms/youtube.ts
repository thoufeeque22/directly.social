import { promises as fs } from "fs";
import { getYouTubeClient } from "./youtube/account";
import { initYouTubeSession } from "./youtube/session";
import { pushYouTubeBinary } from "./youtube/push";
import { PublishParams } from "@/lib/core/platforms/types";

export { getYouTubeClient };

export const uploadToYouTube = async ({
  userId, filePath, title, description, accountId, resumableUrl, onProgress,
}: PublishParams & { resumableUrl?: string; privacy?: string }) => {
  const youtube = await getYouTubeClient(userId, accountId);
  const { size: fileSize } = await fs.stat(filePath);
  
  const uploadUrl = resumableUrl || await initYouTubeSession(youtube, fileSize, {
    snippet: { title, description, tags: ["SocialStudio"], categoryId: "22" },
    status: { privacyStatus: "private", selfDeclaredMadeForKids: false },
  });

  const result = await pushYouTubeBinary(uploadUrl, filePath, 0, fileSize, onProgress);
  return { data: result, resumableUrl: uploadUrl };
};

export const getYouTubeStats = async (userId: string, accountId?: string) => {
  const youtube = await getYouTubeClient(userId, accountId);
  const res = await youtube.channels.list({ part: ["statistics"], mine: true });
  const stats = res.data.items?.[0]?.statistics;
  return stats ? { views: parseInt(stats.viewCount || "0"), subscribers: parseInt(stats.subscriberCount || "0"), videos: parseInt(stats.videoCount || "0") } : null;
};
