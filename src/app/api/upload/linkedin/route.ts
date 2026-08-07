import { NextRequest } from "next/server";
import { handlePlatformUploadRequest, UploadLogicParams } from "@/lib/core/platform-route-handler";
import { publishLinkedInVideo } from "@/lib/platforms/linkedin/video";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  return handlePlatformUploadRequest({
    req,
    platform: "linkedin",
    uploadLogic: async ({ userId, filePath, description, accountId, fields, onProgress }: UploadLogicParams) => {
      return publishLinkedInVideo({
        userId,
        filePath,
        description,
        accountId,
        title: fields.title,
        onProgress
      });
    }
  });
}
