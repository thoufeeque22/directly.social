import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/core/prisma";
import fsSync from "node:fs";
import { formatPlatformCaption } from "./distributor-utils";
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

export async function handlePlatformUploadRequest({ req, platform, uploadLogic }: { req: any; platform: string; uploadLogic: (p: UploadLogicParams) => Promise<any>; }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { fields, isByos, filePath } = await resolveUploadRequest(req);
  try {
    if (isByos && filePath) await downloadByosFile(session.user.id, fields.stagedFileId, filePath);
    if (!filePath || !fsSync.existsSync(filePath)) return NextResponse.json({ error: "No file" }, { status: 400 });
    const activePath = await getOptimizedVideoPath(fields.stagedFileId, platform, fields.historyId).catch(() => filePath!);
    const rc = fields.reviewedContent ? JSON.parse(fields.reviewedContent) : null;
    const enriched = rc ? { title: rc.title, description: rc.description, hashtags: rc.hashtags || [] } : { title: fields.title || "Untitled", description: fields.description || "", hashtags: [] };
    const caption = formatPlatformCaption({ ...enriched, platform });
    if (fields.historyId && fields.accountId) {
      const acc = await prisma.account.findFirst({ where: { id: fields.accountId, userId: session.user.id } });
      await prisma.postPlatformResult.upsert({ where: { postHistoryId_platform_accountId: { postHistoryId: fields.historyId, platform, accountId: fields.accountId } }, update: { status: 'uploading' }, create: { postHistoryId: fields.historyId, platform, accountId: fields.accountId, accountName: acc?.accountName || 'Unknown', status: 'uploading' } });
    }
    const result = await uploadLogic({ userId: session.user.id, filePath: activePath, title: enriched.title, description: caption, videoFormat: fields.videoFormat || "short", accountId: fields.accountId, fields, onProgress: await createProgressReporter(fields.historyId, platform, fields.accountId) });
    if (fields.historyId && fields.accountId) {
      const { extractPlatformPostId, generatePermalink } = await import("./distributor-utils");
      await prisma.postPlatformResult.update({ where: { postHistoryId_platform_accountId: { postHistoryId: fields.historyId, platform, accountId: fields.accountId } }, data: { status: 'success', platformPostId: extractPlatformPostId(platform, result), permalink: generatePermalink(platform, result), progress: 100 } });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    logger.error(` [${platform}] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally { if (isByos && filePath && fsSync.existsSync(filePath)) fsSync.unlinkSync(filePath); }
}
