"use server";
import os from "os";

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import path from 'path';
import fs from 'fs';
import { AIWriteResult } from '@/lib/utils/ai-writer';

// TODO: Refactor: logic extraction needed
/**
 * Saves AI-reviewed platform metadata for scheduled/pending posts.
 */
export async function saveStagedMetadata(stagedFileId: string, reviewedContent: Record<string, AIWriteResult>) {
  return protectedAction(async function saveStaged() {
    const metadataPath = path.join(os.tmpdir(), "directly_social", `${stagedFileId}.metadata.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(reviewedContent, null, 2), "utf8");
    return { success: true };
  });
}

/**
 * Updates platform-specific results with custom AI content.
 */
export async function updatePlatformResultsAction(activityId: string, reviewedContent: Record<string, AIWriteResult>) {
  return protectedAction(async function updateResults(userId) {
    const activity = await prisma.postActivity.findUnique({
      where: { id: activityId, userId },
      include: { platforms: true }
    });

    if (!activity) throw new Error("Activity record not found.");

    // Update each platform result with its specific custom content in a batch transaction
    const updates = activity.platforms.map((p) => {
      const custom = reviewedContent[p.platform];
      if (!custom) return null;

      return prisma.postPlatformResult.update({
        where: { id: p.id },
        data: {
          metadata: {
            title: custom.title,
            description: custom.description,
            hashtags: custom.hashtags
          }
        }
      });
    }).filter((u): u is NonNullable<typeof u> => u !== null);

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    await revalidateDashboard();
    return { success: true };
  });
}
