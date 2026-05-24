import { NextRequest } from "next/server";
import { handlePlatformUploadRequest } from "@/lib/core/platform-route-handler";
import { publishTikTokVideo } from "@/lib/platforms/tiktok";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  return handlePlatformUploadRequest({
    req,
    platform: "tiktok",
    uploadLogic: async ({ userId, filePath, title, description, accountId }: import("@/lib/core/platform-route-handler").UploadLogicParams) => {
      return publishTikTokVideo({
        userId,
        filePath,
        title,
        description,
        accountId
      });
    }
  });
}
