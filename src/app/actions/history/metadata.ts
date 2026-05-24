"use server";

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import path from 'path';
import fs from 'fs';
import { AIWriteResult } from '@/lib/utils/ai-writer';

/**
 * Saves AI-reviewed platform metadata for scheduled/pending posts.
 */
export async function saveStagedMetadata(stagedFileId: string, reviewedContent: Record<string, AIWriteResult>) {
  return protectedAction(async () => {
    const metadataPath = path.join(process.cwd(), "src/tmp", `${stagedFileId}.metadata.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(reviewedContent, null, 2), "utf8");
    return { success: true };
  });
}

/**
 * Updates platform-specific results with custom AI content.
 */
export async function updatePlatformResultsAction(historyId: string, reviewedContent: Record<string, AIWriteResult>) {
  return protectedAction(async (userId) => {
    const history = await prisma.postHistory.findUnique({
      where: { id: historyId, userId },
      include: { platforms: true }
    });

    if (!history) throw new Error("History record not found.");

    // Update each platform result with its specific custom content
    await Promise.all(history.platforms.map((p) => {
      const custom = reviewedContent[p.platform];
      if (!custom) return Promise.resolve();

      return prisma.postPlatformResult.update({
        where: { id: p.id },
        data: {
          metadata: {
            customContent: {
              title: custom.title,
              description: custom.description,
              hashtags: custom.hashtags
            }
          }
        }
      });
    }));

    await revalidateDashboard();
    return { success: true };
  });
}
