import { prisma } from '@/lib/core/prisma';
import { logger } from '@/lib/core/logger';

/**
 * Synchronizes the GalleryAsset expiry date with the post's scheduled date.
 */
export async function syncGalleryExpiry(fileId: string | null, scheduledAt: Date | null) {
  if (fileId && scheduledAt) {
    const newExpiry = new Date(scheduledAt.getTime() + 48 * 60 * 60 * 1000);
    await prisma.galleryAsset.updateMany({
      where: { fileId },
      data: { expiresAt: newExpiry }
    }).catch((e: unknown) => logger.warn("Failed to sync gallery expiry", e));
  }
}
