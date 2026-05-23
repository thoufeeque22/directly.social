import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/core/prisma";
import fsSync from "node:fs";
import path from "node:path";
import { streamMultipartFormData } from "@/lib/upload/streaming-parser";
import { formatPlatformCaption, PlatformData } from "./distributor-utils";
import { getOptimizedVideoPath } from "@/lib/video/transcode-manager";
import { logger } from "@/lib/core/logger";
import { decryptByos } from "./byos-encrypt";
import { S3Client, GetObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

interface PlatformHandlerParams {
  req: NextRequest;
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'local';
  uploadLogic: (params: {
    userId: string;
    filePath: string;
    title: string;
    description: string;
    videoFormat: string;
    accountId?: string;
    fields: Record<string, string>;
    onProgress?: (percent: number) => void;
  }) => Promise<unknown>;
}

async function downloadByosFile(userId: string, fileId: string, destPath: string) {
  const asset = await prisma.galleryAsset.findFirst({
    where: { fileId, userId }
  });

  if (!asset) {
    throw new Error(`Gallery asset not found: ${fileId}`);
  }

  const metadata = asset.metadata as { byos?: boolean; bucket: string; key: string } | null;
  if (!metadata || !metadata.byos) {
    throw new Error(`Asset ${fileId} is not a valid BYOS asset`);
  }

  const { key } = metadata;

  const byosConfig = await prisma.byosConfig.findUnique({
    where: { userId }
  });

  if (!byosConfig) {
    throw new Error(`BYOS is not configured for user ${userId}`);
  }

  const decryptedAccessKeyId = decryptByos(byosConfig.accessKeyId);
  const decryptedSecretAccessKey = decryptByos(byosConfig.secretAccessKey);

  const s3Config: S3ClientConfig = {
    credentials: {
      accessKeyId: decryptedAccessKeyId,
      secretAccessKey: decryptedSecretAccessKey,
    },
    region: byosConfig.region || "us-east-1",
  };

  if (byosConfig.provider === "R2") {
    if (!byosConfig.endpoint) {
      throw new Error("Endpoint is required for Cloudflare R2");
    }
    s3Config.endpoint = byosConfig.endpoint;
    s3Config.region = byosConfig.region || "auto";
  } else if (byosConfig.endpoint) {
    s3Config.endpoint = byosConfig.endpoint;
  }

  const s3 = new S3Client(s3Config);

  logger.info(`🌐 [BYOS STREAM] Downloading ${key} from ${byosConfig.bucketName}...`);

  const response = await s3.send(new GetObjectCommand({
    Bucket: byosConfig.bucketName,
    Key: key
  }));

  if (!response.Body) {
    throw new Error("S3 response body is empty");
  }

  await fsSync.promises.mkdir(path.dirname(destPath), { recursive: true });

  const writeStream = fsSync.createWriteStream(destPath);
  await pipeline(response.Body as Readable, writeStream);
  
  logger.info(`✅ [BYOS STREAM] Downloaded completed to: ${destPath}`);
}

/**
 * UNIFIED PLATFORM ROUTE HANDLER
 * Handles boilerplate for all platform-specific upload routes.
 */
export async function handlePlatformUploadRequest({
  req,
  platform,
  uploadLogic
}: PlatformHandlerParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let filePath: string | undefined;
  let isByos = false;

  try {
    let fileName: string | undefined;
    let fields: Record<string, string> = {};

    // 1. Resolve Staged File vs Multipart Stream
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (!body.stagedFileId) {
        logger.info(" [PLATFORM] JSON request missing stagedFileId");
        return NextResponse.json({ error: "JSON request missing stagedFileId" }, { status: 400 });
      }
      if (body.stagedFileId.startsWith("byos_")) {
        isByos = true;
      }
      // Security check: ensure the file is strictly within src/tmp
      const safeFileId = path.basename(body.stagedFileId);
      filePath = path.join(process.cwd(), "src/tmp", safeFileId);
      fields = body;
      fileName = body.fileName;
    } else if (contentType.includes("multipart/form-data")) {
      const parsed = await streamMultipartFormData(req);
      filePath = parsed.filePath;
      fields = parsed.fields;
      fileName = parsed.fileName;
    } else {
      logger.info(` [PLATFORM] Unsupported Content-Type: ${contentType}`);
      return NextResponse.json({ error: `Unsupported Content-Type: ${contentType}` }, { status: 400 });
    }

    // If BYOS, stream file on-demand to temp location
    if (isByos && filePath && fields.stagedFileId) {
      try {
        await downloadByosFile(session.user.id, fields.stagedFileId, filePath);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(` [BYOS STREAM] Streaming failed: ${msg}`);
        return NextResponse.json({ error: `BYOS download failed: ${msg}` }, { status: 500 });
      }
    }

    if (!filePath || !fsSync.existsSync(filePath)) {
      logger.info(` [PLATFORM] File not found or path invalid. Path: "${filePath}". Exists: ${filePath ? fsSync.existsSync(filePath) : 'false'}`);
      return NextResponse.json({ error: "No file uploaded or streaming failed" }, { status: 400 });
    }

    const rawTitle = fields.title || fileName || "Untitled Video";
    const rawDescription = fields.description || "";
    const videoFormat = fields.videoFormat || "short";
    const accountId = fields.accountId;
    const historyId = fields.historyId;

    // 2.5 OPTIMIZATION LAYER (FFMPEG)
    let activeFilePath = filePath;
    try {
      const stagedFileId = fields.stagedFileId || path.basename(filePath);
      activeFilePath = await getOptimizedVideoPath(stagedFileId, platform, historyId);
    } catch (transError) {
      logger.warn(`️ [${platform}] Optimization failed, falling back to original:`, transError);
    }

    // 3. SECURITY: Verify account ownership before proceeding
    let accountName = 'Unknown Account';
    if (accountId) {
      const account = await prisma.account.findFirst({
        where: { id: accountId, userId: session.user.id }
      });
      if (!account) {
        return NextResponse.json({ 
          error: "Unauthorized: Account not found or not owned by user" 
        }, { status: 403 });
      }
      accountName = account.accountName || 'Unknown Account';
      logger.info(` [SECURITY] Account ownership verified for ${platform}: ${accountId} (${accountName})`);
    }

    // 3. MOCK_UPLOAD Check
    if (process.env.MOCK_UPLOAD === "true") {
      logger.info(` [MOCK MODE] Skipping actual ${platform} API upload.`);
      return NextResponse.json({ 
        success: true, 
        data: { id: `mock-${platform}-${Date.now()}` } 
      });
    }

    // 4. Enrich through Intelligence Layer (AI)
    let enrichedContent: { title: string; description: string; hashtags: string[] };
    if (fields.reviewedContent) {
      logger.info(` [${platform}] Using user-reviewed AI content.`);
      const rc = JSON.parse(fields.reviewedContent) as import('@/lib/utils/ai-writer').AIWriteResult;
      enrichedContent = {
        title: rc.title || '',
        description: rc.description || '',
        hashtags: rc.hashtags || []
      };
    } else {
      logger.info(` [${platform}] Using Manual content.`);
      enrichedContent = {
        title: rawTitle,
        description: rawDescription,
        hashtags: []
      };
    }
    const finalCaption = formatPlatformCaption({
        title: enrichedContent.title,
        description: enrichedContent.description,
        hashtags: enrichedContent.hashtags,
        platform
    });

    if (historyId && accountId) {
      await prisma.postPlatformResult.upsert({
        where: {
          postHistoryId_platform_accountId: {
            postHistoryId: historyId,
            platform,
            accountId
          }
        },
        update: { status: 'uploading' },
        create: {
          postHistoryId: historyId,
          platform,
          accountId,
          accountName,
          status: 'uploading'
        }
      });
    }

    // 5. Execute Platform-Specific SDK Logic with Unified Heartbeat
    try {
      let lastReported = -1;
      const wrappedOnProgress = async (percent: number) => {
        const currentPercent = Math.floor(percent);
        if (currentPercent > lastReported && historyId && accountId) {
          lastReported = currentPercent;
          logger.info(` [HEARTBEAT] ${platform} (${accountId}): ${currentPercent}%`);
          const { updatePlatformProgress } = await import("./heartbeat-server");
          await updatePlatformProgress(historyId, platform, accountId, currentPercent);
        }
      };

      const result = await uploadLogic({
        userId: session.user.id,
        filePath: activeFilePath,
        title: enrichedContent.title,
        description: finalCaption,
        videoFormat,
        accountId,
        fields,
        onProgress: wrappedOnProgress
      });

      if (historyId && accountId) {
        const { extractPlatformPostId, generatePermalink } = await import("./distributor-utils");
        const platformData = result as PlatformData;
        const platformPostId = extractPlatformPostId(platform, platformData);
        const permalink = generatePermalink(platform, platformData);

        await prisma.postPlatformResult.update({
          where: {
            postHistoryId_platform_accountId: {
              postHistoryId: historyId,
              platform,
              accountId
            }
          },
          data: {
            status: 'success',
            platformPostId,
            permalink,
            progress: 100
          }
        });
        logger.info(` [${platform}] Database updated to success for history: ${historyId}`);
      }

      return NextResponse.json({ success: true, data: result });
    } catch (apiError: unknown) {
      logger.error(` [${platform}] API Error:`, apiError);
      const e = apiError as Record<string, unknown>;
      const errorMessage = (e.message as string) || String(e);

      if (historyId && accountId) {
        await prisma.postPlatformResult.update({
          where: {
            postHistoryId_platform_accountId: {
              postHistoryId: historyId,
              platform,
              accountId
            }
          },
          data: {
            status: 'failed',
            errorMessage
          }
        });
      }

      return NextResponse.json({ 
        success: false, 
        error: errorMessage,
        resumableUrl: e.resumableUrl as string | undefined,
        videoId: e.videoId as string | undefined,
        creationId: e.creationId as string | undefined
      }, { status: e.status === 'failed' ? 200 : 500 });
    }
  } catch (error: unknown) {
    logger.error(` [${platform}] Route Error:`, error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
        success: false, 
        error: message || `${platform} upload failed` 
    }, { status: 500 });
  } finally {
    // Zero-leak server disk cleanup for BYOS downloads
    if (isByos && filePath && fsSync.existsSync(filePath)) {
      try {
        fsSync.unlinkSync(filePath);
        logger.info(`🧹 [BYOS CLEANUP] Cleaned up temporary BYOS file: ${filePath}`);
      } catch (cleanupErr) {
        logger.warn(`⚠️ [BYOS CLEANUP] Failed to delete temporary BYOS file:`, cleanupErr);
      }
    }
  }
}
