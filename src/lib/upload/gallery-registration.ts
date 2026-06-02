import { prisma } from "@/lib/core/prisma";
import { VideoMetadata } from "@/lib/video/processor";
import { logger } from "@/lib/core/logger";

function getExpiryDate(scheduledAt?: string | null) {
  const parsed = scheduledAt ? new Date(scheduledAt) : null;
  const base = parsed && !isNaN(parsed.getTime()) ? parsed : new Date();
  return new Date(base.getTime() + (scheduledAt ? 48 : 7 * 24) * 60 * 60 * 1000);
}

export interface GalleryRegistrationParams {
  userId: string;
  fileId: string;
  fileName: string;
  size: number;
  finalPath: string;
  checksum?: string;
  scheduledAt?: string | null;
  videoMetadata?: VideoMetadata | null;
}

export async function registerGalleryAsset(params: GalleryRegistrationParams) {
  const { userId, fileId, fileName, size, checksum, scheduledAt, videoMetadata } = params;
  const expiresAt = getExpiryDate(scheduledAt);
  
  // Enhanced deduplication using checksum if available, fallback to fileName + size
  const existingAsset = checksum 
    ? await prisma.galleryAsset.findFirst({ where: { userId, checksum } })
    : await prisma.galleryAsset.findFirst({ where: { userId, fileName, fileSize: BigInt(size) } });

  const metadata = videoMetadata as unknown as Record<string, unknown> | undefined;

  if (existingAsset) {
    logger.info(`🔄 [GALLERY] Updating existing asset to prevent duplicate: ${fileName} (Checksum: ${checksum || 'N/A'})`);
    await prisma.galleryAsset.update({
      where: { id: existingAsset.id },
      data: { 
        fileId, 
        fileName, // Update name in case it changed
        expiresAt, 
        createdAt: new Date(), 
        metadata,
        checksum,
        checksumType: checksum ? "sha256" : undefined
      },
    });
  } else {
    await prisma.galleryAsset.create({
      data: { 
        userId, 
        fileId, 
        fileName, 
        fileSize: BigInt(size), 
        mimeType: "video/mp4", 
        expiresAt, 
        metadata,
        checksum,
        checksumType: checksum ? "sha256" : undefined
      },
    });
  }
}
