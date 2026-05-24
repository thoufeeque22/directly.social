import { promises as fs } from "fs";
import { getTikTokAccount } from "./tiktok/account";
import { initTikTokPublish, pushTikTokBinary } from "./tiktok/publish";
import { PublishParams } from "@/lib/core/platforms/types";

export { getTikTokAccount };

interface TikTokParams extends PublishParams {
  videoPath?: string;
}

export const publishTikTokVideo = async ({
  userId, filePath, videoPath, title, description, accountId,
}: TikTokParams) => {
  const account = await getTikTokAccount(userId, accountId);
  const path = filePath || videoPath;
  if (!path) throw new Error("No video file path provided.");
  
  const { size: videoSize } = await fs.stat(path);

  const { upload_url, publish_id } = await initTikTokPublish(
    account.access_token!, videoSize, title || description || "", "SELF_ONLY"
  );

  await pushTikTokBinary(upload_url, path, videoSize);
  return { publish_id, upload_url }; // Return upload_url for tests if needed
};
