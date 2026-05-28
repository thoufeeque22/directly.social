import { prisma } from '@/lib/core/prisma';
import { logger } from '@/lib/core/logger';
import { PlatformResultInput } from './schema';

export async function generateAutoTitle(userId: string, currentTitle: string) {
  if (!currentTitle || currentTitle.trim() === "" || /^\d+$/.test(currentTitle)) {
    const lastPost = await prisma.postActivity.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    const lastNum = parseInt(lastPost?.title.match(/\d+/)?.[0] || "0", 10);
    const newTitle = `${lastNum + 1}`;
    logger.info(`[DEV-AUTO-TITLE] Incrementing title to: ${newTitle}`);
    return newTitle;
  }
  return currentTitle;
}

export function mapPlatformInputs(platforms: PlatformResultInput[]) {
  return platforms.map((p) => ({
    ...p,
    accountName: p.accountName || null,
    platformPostId: p.platformPostId || null,
    permalink: p.permalink || null,
    errorMessage: p.errorMessage || null,
    resumableUrl: p.resumableUrl || null,
    videoId: p.videoId || null,
    creationId: p.creationId || null,
    metadata: p.metadata ?? undefined,
  }));
}

export async function syncGalleryExpiry(fileId: string | null, scheduledAt: Date | null) {
  if (!fileId) return;
  const base = scheduledAt && !isNaN(scheduledAt.getTime()) ? scheduledAt : new Date();
  const hours = scheduledAt ? 48 : 7 * 24;
  const expiresAt = new Date(base.getTime() + hours * 60 * 60 * 1000);
  
  await prisma.galleryAsset.updateMany({
    where: { fileId },
    data: { expiresAt }
  });
}
