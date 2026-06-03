import path from 'path';
import { logger } from '@/lib/core/logger';
import { extractPlatformPostId, generatePermalink } from '@/lib/core/distributor-utils';
import { distributeSinglePlatform } from '@/lib/core/distributor-server';
import { fetchExistingResult, upsertPlatformResult, updatePlatformProgress, recordPlatformFailure } from './server-distributor.db';
import { preparePlatformMetadata, resolveVideoPath } from './server-distributor.logic';

export interface DistributionResult {
  platform: string; accountId: string; accountName?: string | null; platformPostId?: string | null; permalink?: string | null;
  status: 'success' | 'failed' | 'cancelled' | 'pending' | 'uploading' | 'processing' | 'retrying';
  errorMessage?: string; resumableUrl?: string | null; videoId?: string | null; creationId?: string | null;
}

export interface ServerDistributeParams {
  stagedFileId: string; userId: string; activityId: string; title: string; description: string; videoFormat: 'short' | 'long';
  platforms: { platform: string; accountId: string; accountName: string | null; }[];
  reviewedContent?: Record<string, { title: string; description: string; hashtags?: string[] }>;
}

/**
 * (CA-002): Lean orchestrator for server-side distribution.
 * Logic extracted to .db and .logic modules to meet 100-line limit.
 */
export async function distributeToPlatformsServer(params: ServerDistributeParams) {
  const { stagedFileId, userId, activityId, title, description, videoFormat, platforms } = params;
  logger.info(`👷 [SERVER-DISTRIBUTOR] Starting distribution for post ${activityId}`);

  const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), "tmp", stagedFileId);
  const results: DistributionResult[] = [];

  await Promise.allSettled(platforms.map(async (p) => {
    try {
      const existing = await fetchExistingResult(activityId, p.platform, p.accountId);
      if (existing?.status === 'cancelled') {
        results.push({ platform: p.platform, accountId: p.accountId, accountName: existing.accountName, status: 'cancelled', resumableUrl: existing.resumableUrl });
        return;
      }

      const { finalTitle, finalDesc } = preparePlatformMetadata(p.platform, title, description, existing?.metadata, params.reviewedContent);
      const currentResult = await upsertPlatformResult(activityId, p.platform, p.accountId, { status: 'uploading', accountName: p.accountName });
      const activeFilePath = await resolveVideoPath(stagedFileId, p.platform, activityId, p.accountId, filePath);

      const rawData = await distributeSinglePlatform({
        platform: p.platform, userId, filePath: activeFilePath, title: finalTitle, description: finalDesc, videoFormat, accountId: p.accountId,
        fields: { resumableUrl: existing?.resumableUrl, videoId: existing?.videoId, creationId: existing?.creationId },
        onProgress: (pct) => updatePlatformProgress(currentResult.id, pct)
      });

      const res: DistributionResult = {
        platform: p.platform, accountId: p.accountId, accountName: p.accountName,
        platformPostId: extractPlatformPostId(p.platform, rawData), permalink: generatePermalink(p.platform, rawData),
        status: 'success', videoId: rawData?.videoId || rawData?.id, creationId: rawData?.creationId
      };

      await upsertPlatformResult(activityId, p.platform, p.accountId, res);
      results.push(res);
    } catch (err: unknown) {
      logger.error(`❌ [SERVER-DISTRIBUTOR] Failed to publish to ${p.platform}: ${(err as any).message}`);
      await recordPlatformFailure(activityId, p.platform, p.accountId, err);
    }
  }));

  return results;
}