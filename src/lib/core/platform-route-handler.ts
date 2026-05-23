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
    if (!filePath || !fsSync.existsSync(filePath)) return NextResponse.json({ error: "No file" }, { status: 400 });
    const activePath = await getOptimizedVideoPath(stagedId || '', platform, fields.historyId as string).catch(() => filePath!);
    const rc = fields.reviewedContent ? (JSON.parse(fields.reviewedContent as string) as Record<string, unknown>) : null;
    const enriched = rc ? { title: rc.title as string, description: rc.description as string, hashtags: (rc.hashtags as string[]) || [] } : { title: (fields.title as string) || (fields.fileName as string) || "Untitled", description: (fields.description as string) || "", hashtags: [] };
    const caption = formatPlatformCaption({ ...enriched, platform });
    if (fields.accountId) {
      const acc = await prisma.account.findFirst({ where: { id: fields.accountId as string, userId: session.user.id } });
      if (!acc) return NextResponse.json({ error: "Unauthorized: Account not found or not owned by user" }, { status: 403 });
      
      if (fields.historyId) {
        await prisma.postPlatformResult.upsert({ where: { postHistoryId_platform_accountId: { postHistoryId: fields.historyId as string, platform, accountId: fields.accountId as string } }, update: { status: 'uploading' }, create: { postHistoryId: fields.historyId as string, platform, accountId: fields.accountId as string, accountName: acc.accountName || 'Unknown', status: 'uploading' } });
      }
    }
    
    const result = await uploadLogic({ userId: session.user.id, filePath: activePath, title: enriched.title, description: caption, videoFormat: (fields.videoFormat as string) || "short", accountId: fields.accountId as string, fields: fields as Record<string, string>, onProgress: await createProgressReporter(fields.historyId as string, platform, fields.accountId as string) });
    
    if (fields.historyId && fields.accountId) {
      const { extractPlatformPostId, generatePermalink } = await import("./distributor-utils");
      const platformData = result as PlatformData;
      await prisma.postPlatformResult.update({ 
        where: { postHistoryId_platform_accountId: { postHistoryId: fields.historyId as string, platform, accountId: fields.accountId as string } }, 
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
