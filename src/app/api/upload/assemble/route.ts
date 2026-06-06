import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { logger } from "@/lib/core/logger";
import { UploadAssembleSchema } from "@/lib/schemas/upload-pipeline";
import { assembleChunks, UploadAssemblyError } from "@/lib/upload/chunk-assembler";
import { registerGalleryAsset } from "@/lib/upload/gallery-registration";
import { upsertUploadActivity, PlatformInput } from "@/lib/upload/activity-registration";
import { getVideoMetadata, checkTranscodeRequirement } from "@/lib/video/processor";

export const maxDuration = 300; 

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = UploadAssembleSchema.safeParse(await req.json());
    if (!result.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const p = result.data;
    const { fileId, finalPath, size, checksum } = await assembleChunks(p.uploadId, p.fileName, p.totalChunks, p.totalSize);

    let videoMetadata = null;
    try { videoMetadata = await getVideoMetadata(finalPath); } 
    catch (e) { logger.warn("Metadata extraction failed:", e); }

    try { await registerGalleryAsset({ userId: session.user.id, fileId, fileName: p.fileName, size, finalPath, checksum, scheduledAt: p.scheduledAt, videoMetadata }); } 
    catch (e) { logger.warn("Gallery registration failed:", e); }

    let transcodeResults = {};
    if (p.platforms) {
      try {
        transcodeResults = (await checkTranscodeRequirement(finalPath, p.platforms.map(x => x.platform))).results;
      } catch (e) {
        logger.warn("Transcode check failed:", e);
      }
    }
    const activity = await upsertUploadActivity({
      userId: session.user.id, fileId, fileName: p.fileName, finalPath, activityId: p.activityId, title: p.title, description: p.description, videoFormat: p.videoFormat, platforms: p.platforms as PlatformInput[], scheduledAt: p.scheduledAt, transcodeResults
    });

    return NextResponse.json({ success: true, data: { fileId, fileName: p.fileName, activityId: activity.id } });
  } catch (error: unknown) {
    logger.error("Assembly Error:", error);
    if (error instanceof UploadAssemblyError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
