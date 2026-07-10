import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/core/prisma";
import fsSync from "node:fs";
import { formatPlatformCaption, PlatformData } from "./distributor-utils";
import { getOptimizedVideoPath } from "@/lib/video/transcode-manager";
import { logger } from "@/lib/core/logger";
import { downloadByosFile } from "@/lib/byos/downloader";
import { createProgressReporter } from "./progress-utils";
import { resolveUploadRequest } from "./upload-resolver";

export interface UploadLogicParams {
  userId: string; filePath: string; title: string; description: string;
  videoFormat: string; accountId?: string; fields: Record<string, string>;
  onProgress?: (percent: number) => void;
}

type SupportedPlatform = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'local';

interface HandlerParams {
  req: NextRequest;
  platform: SupportedPlatform;
  uploadLogic: (p: UploadLogicParams) => Promise<unknown>;
}

export async function handlePlatformUploadRequest({ req, platform, uploadLogic }: HandlerParams) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { fields, isByos, filePath } = await resolveUploadRequest(req);
  try {
    const stagedId = fields.stagedFileId as string | undefined;
    if (isByos && filePath && stagedId) await downloadByosFile(session.user.id, stagedId, filePath);
    if (!isByos && filePath && stagedId && !fsSync.existsSync(filePath)) {
      const asset = await prisma.galleryAsset.findUnique({ where: { fileId: stagedId } });
      const blobUrl = (asset?.metadata as Record<string, unknown>)?.blobUrl as string | undefined;
      if (blobUrl) {
        const { downloadVercelBlobToTemp } = await import("@/lib/upload/blob-downloader");
        await downloadVercelBlobToTemp(blobUrl, filePath);
      }
    }
    if (!filePath || !fsSync.existsSync(filePath)) return NextResponse.json({ error: "No file" }, { status: 400 });
    const activePath = await getOptimizedVideoPath(stagedId || '', platform, fields.activityId as string).catch(() => filePath!);
    const rc = fields.reviewedContent ? (JSON.parse(fields.reviewedContent as string) as Record<string, unknown>) : null;
    const enriched = rc ? { title: rc.title as string, description: rc.description as string, hashtags: (rc.hashtags as string[]) || [] } : { title: (fields.title as string) || (fields.fileName as string) || "Untitled", description: (fields.description as string) || "", hashtags: [] };
    const caption = formatPlatformCaption({ ...enriched, platform });
    if (fields.accountId) {
      const accIdStr = fields.accountId as string;
      const isMock = process.env.NODE_ENV !== 'production' && (accIdStr.startsWith('mock-') || accIdStr.startsWith('local-dev-'));
      const acc = await prisma.account.findFirst({ where: { id: accIdStr, userId: session.user.id } });
      
      if (!acc && !isMock) {
        return NextResponse.json({ error: "Unauthorized: Account not found or not owned by user" }, { status: 403 });
      }
      
      if (fields.activityId) {
        await prisma.postPlatformResult.upsert({ where: { postActivityId_platform_accountId: { postActivityId: fields.activityId as string, platform, accountId: accIdStr } }, update: { status: 'uploading' }, create: { postActivityId: fields.activityId as string, platform, accountId: accIdStr, accountName: acc?.accountName || 'Mock Account', status: 'uploading' } });
      }
      
      if (isMock) {
        const { handleMockPlatformUpload } = await import("@/lib/testing/mock-platform-handler");
        return handleMockPlatformUpload(fields.activityId as string | undefined, platform, accIdStr);
      }
    }
    
    const result = await uploadLogic({ userId: session.user.id, filePath: activePath, title: enriched.title, description: caption, videoFormat: (fields.videoFormat as string) || "short", accountId: fields.accountId as string, fields: fields as Record<string, string>, onProgress: await createProgressReporter(fields.activityId as string, platform, fields.accountId as string) });
    
    if (fields.activityId && fields.accountId) {
      const { extractPlatformPostId, generatePermalink } = await import("./distributor-utils");
      const platformData = result as PlatformData;
      await prisma.postPlatformResult.update({ 
        where: { postActivityId_platform_accountId: { postActivityId: fields.activityId as string, platform, accountId: fields.accountId as string } }, 
        data: { 
          status: 'success', 
          platformPostId: extractPlatformPostId(platform, platformData), 
          permalink: generatePermalink(platform, platformData), 
          progress: 100 
        } 
      });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(` [${platform}] Error:`, msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  } finally { if (isByos && filePath && fsSync.existsSync(filePath)) fsSync.unlinkSync(filePath); }
}
