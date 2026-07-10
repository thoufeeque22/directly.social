import os from "os";
import { prisma } from "@/lib/core/prisma";
import { workerLogger as logger } from "@/lib/core/logger";
import * as Sentry from "@sentry/nextjs";
import path from "path";
import { readFileSync, existsSync, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { refreshTokenIfNecessary } from "@/lib/auth/token-refresher";

const getTempDir = () => {
  const base = process.env.UPLOAD_TEMP_DIR || path.join(/*turbopackIgnore: true*/ os.tmpdir(), "directly_social");
  if (process.env.TEST_WORKER_INDEX) {
    return path.join(/*turbopackIgnore: true*/ base, `worker-${process.env.TEST_WORKER_INDEX}`);
  }
  return base;
};

export async function processPendingPosts() {
  const now = new Date();
  const pending = await prisma.postActivity.findMany({
    where: {
      isPublished: false,
      stagedFileId: { not: null },
      scheduledAt: { lte: now }
    },
    include: {
      platforms: true,
      user: { include: { accounts: true } }
    }
  });

  if (pending.length === 0) return;

  logger.info(`👷 [WORKER] Found ${pending.length} overdue posts. Processing...`);

  await Promise.allSettled(pending.map(async (post) => {
    try {
      await prisma.postActivity.update({ where: { id: post.id }, data: { isPublished: true } });

      const stagedFileId = post.stagedFileId!;
      for (const platformResult of post.platforms) {
         if (platformResult.accountId) {
            await refreshTokenIfNecessary(platformResult.accountId).catch(err => {
              logger.error(`[WORKER] Token refresh failed for account ${platformResult.accountId}:`, err);
            });
         }
      }

      const tempDir = getTempDir();
      
      let safeFileId = stagedFileId;
      if (stagedFileId.startsWith('http')) {
        // It's a Vercel Blob URL, extract filename
        safeFileId = stagedFileId.split('/').pop() || `video_${Date.now()}.mp4`;
      }
      
      const filePath = path.join(/*turbopackIgnore: true*/ tempDir, safeFileId);
      
      if (stagedFileId.startsWith('http') && !existsSync(filePath)) {
        logger.info(`[WORKER] Downloading remote blob ${stagedFileId} to ${filePath}`);
        await import("fs/promises").then(m => m.mkdir(tempDir, { recursive: true }));
        const res = await fetch(stagedFileId);
        if (!res.ok || !res.body) throw new Error(`Failed to download blob: ${res.statusText}`);
        
        // @ts-expect-error Node 18+ Web Streams to Node Streams
        await pipeline(res.body, createWriteStream(filePath));
        logger.info(`[WORKER] Download complete`);
      } else if (!existsSync(filePath)) {
        throw new Error(`File missing: ${filePath}`);
      }


      const metadataPath = path.join(/*turbopackIgnore: true*/ tempDir, `${stagedFileId}.metadata.json`);
      let reviewedContent = undefined;
      if (existsSync(metadataPath)) {
         try {
            reviewedContent = JSON.parse(readFileSync(metadataPath, "utf8"));
         } catch {
            logger.warn("⚠️ [WORKER] Failed to parse metadata sidecar");
         }
      }

      const { distributeToPlatformsServer } = await import('../server-distributor');
      await distributeToPlatformsServer({
        stagedFileId: safeFileId,
        userId: post.userId,
        activityId: post.id,
        title: post.title,
        description: post.description || "",
        videoFormat: post.videoFormat as 'short' | 'long',
        platforms: post.platforms.map((p) => ({
          platform: p.platform,
          accountId: p.accountId!,
          accountName: p.accountName
        })),
        reviewedContent
      });

      logger.info(`✅ [WORKER] Published successfully: ${post.title}`);
    } catch (err: unknown) {
      logger.error(`❌ [WORKER] Failed to publish ${post.title}:`, err);
      Sentry.captureException(err, { extra: { postId: post.id } });
    }
  }));
}
