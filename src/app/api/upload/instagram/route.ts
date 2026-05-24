import { NextRequest } from "next/server";
import { handlePlatformUploadRequest } from "@/lib/core/platform-route-handler";
import { publishInstagramReel } from "@/lib/platforms/instagram";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  return handlePlatformUploadRequest({
    req,
    platform: "instagram",
    uploadLogic: async ({ userId, filePath, description, accountId, fields }: import("@/lib/core/platform-route-handler").UploadLogicParams) => {
      return publishInstagramReel({
        userId,
        filePath,
        description,
        accountId,
        creationId: fields.creationId,
        musicId: fields.musicId,
      });
    }
  });
}
