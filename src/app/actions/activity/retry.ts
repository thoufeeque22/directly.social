/* eslint-disable max-lines */
"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction } from '@/lib/core/action-utils';
import { extractPlatformPostId, generatePermalink } from '@/lib/core/distributor-utils';
import { distributeSinglePlatform } from '@/lib/core/distributor-server';
import path from 'path';
import fs from 'fs';
import { logger } from '@/lib/core/logger';

// TODO: Refactor: logic extraction needed
/**
 * Retries a failed upload attempt for a specific platform.
 */
export async function retryUploadAction(resultId: string) {
  return protectedAction(async (userId) => {
    const result = await prisma.postPlatformResult.findUnique({
      where: { id: resultId },
      include: { postActivity: true }
    });

    if (!result || result.postActivity.userId !== userId) {
      throw new Error('Upload result not found.');
    }

    // 1. Mark as retrying
    await prisma.postPlatformResult.update({
       where: { id: resultId },
       data: { 
         status: 'retrying',
         errorMessage: null,
         retryCount: { increment: 1 },
         lastRetryAt: new Date()
       }
    });

    try {
      const stagedFileId = result.postActivity.stagedFileId;
      if (!stagedFileId) throw new Error("Original staged file reference missing.");

      const filePath = path.join(process.cwd(), "tmp", stagedFileId);
      if (!fs.existsSync(filePath)) {
        throw new Error("Source video file has been purged from the server (24h limit).");
      }

      // 2. USE CENTRALIZED LOGIC
      const platformResult = await distributeSinglePlatform({
        platform: result.platform,
        userId,
        filePath,
        title: result.postActivity.title,
        description: result.postActivity.description || "",
        videoFormat: result.postActivity.videoFormat as "short" | "long",
        accountId: result.accountId || undefined,
        fields: {
          resumableUrl: result.resumableUrl,
          videoId: result.videoId,
          creationId: result.creationId
        }
      });

      // 3. Update with success
      const castResult = platformResult as { videoId?: string; id?: string; creationId?: string };
      await prisma.postPlatformResult.update({
        where: { id: resultId },
        data: { 
          status: 'success',
          platformPostId: extractPlatformPostId(result.platform, platformResult),
          permalink: generatePermalink(result.platform, platformResult),
          videoId: castResult.videoId || castResult.id,
          creationId: castResult.creationId,
          errorMessage: null
        }
      });

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown retry error";
      logger.error(`Retry attempt failed for ${result.platform}`, err);
      await prisma.postPlatformResult.update({
        where: { id: resultId },
        data: { 
          status: 'failed', 
          errorMessage: message,
          resumableUrl: (err as { resumableUrl?: string }).resumableUrl || result.resumableUrl,
          videoId: (err as { videoId?: string }).videoId || result.videoId,
          creationId: (err as { creationId?: string }).creationId || result.creationId
        }
      });
      return { success: false, error: message };
    }
  });
}
