import { prisma } from '@/lib/core/prisma';
import { logger } from '@/lib/core/logger';
import { extractPlatformPostId, generatePermalink, PlatformData } from '@/lib/core/distributor-utils';
import { ResultWithActivity } from './prisma-helpers';

interface RetryError {
  resumableUrl?: string;
  videoId?: string;
  creationId?: string;
}

export async function updateRetrySuccess(resultId: string, platform: string, platformResult: PlatformData) {
  const cast = platformResult as { videoId?: string; id?: string; creationId?: string };
  return await prisma.postPlatformResult.update({
    where: { id: resultId },
    data: { 
      status: 'success',
      platformPostId: extractPlatformPostId(platform, platformResult),
      permalink: generatePermalink(platform, platformResult),
      videoId: cast.videoId || cast.id,
      creationId: cast.creationId,
      errorMessage: null
    }
  });
}

export async function updateRetryFailure(resultId: string, platform: string, err: unknown, originalResult: ResultWithActivity) {
  const message = err instanceof Error ? err.message : "Unknown retry error";
  const retryErr = err as RetryError;
  logger.error(`Retry attempt failed for ${platform}`, err);
  return await prisma.postPlatformResult.update({
    where: { id: resultId },
    data: { 
      status: 'failed', 
      errorMessage: message,
      resumableUrl: retryErr?.resumableUrl || originalResult.resumableUrl,
      videoId: retryErr?.videoId || originalResult.videoId,
      creationId: retryErr?.creationId || originalResult.creationId
    }
  });
}
