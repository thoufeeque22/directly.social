import { distributeSinglePlatform } from '@/lib/core/distributor-server';
import { updateRetrySuccess, updateRetryFailure } from './retry-helpers';
import { ResultWithActivity } from './prisma-helpers';
import { PlatformData } from '@/lib/core/distributor-utils';
import path from 'path';
import fs from 'fs';

export async function executeRetry(resultId: string, result: ResultWithActivity, userId: string) {
  try {
    const stagedFileId = result.postActivity.stagedFileId;
    if (!stagedFileId) throw new Error("Original staged file reference missing.");

    const filePath = path.join(process.cwd(), "tmp", stagedFileId);
    if (!fs.existsSync(filePath)) throw new Error("Source video file has been purged from the server (24h limit).");

    const platformResult = await distributeSinglePlatform({
      platform: result.platform,
      userId,
      filePath,
      title: result.postActivity.title,
      description: result.postActivity.description || "",
      videoFormat: result.postActivity.videoFormat as "short" | "long",
      accountId: result.accountId || undefined,
      fields: { resumableUrl: result.resumableUrl || undefined, videoId: result.videoId || undefined, creationId: result.creationId || undefined }
    }) as PlatformData;

    await updateRetrySuccess(resultId, result.platform, platformResult);
    return { success: true };
  } catch (err: unknown) {
    await updateRetryFailure(resultId, result.platform, err, result);
    return { success: false, error: err instanceof Error ? err.message : "Retry failed" };
  }
}
