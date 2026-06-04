import { prisma } from "@/lib/core/prisma";
import path from "path";
import { existsSync, promises as fs } from "fs";
import { workerLogger as logger } from "@/lib/core/logger";

const getTempDir = () => {
  const base = process.env.UPLOAD_TEMP_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "tmp");
  if (process.env.TEST_WORKER_INDEX) {
    return path.join(/*turbopackIgnore: true*/ base, `worker-${process.env.TEST_WORKER_INDEX}`);
  }
  return base;
};

export async function purgeExpiredAssets() {
  try {
    const now = new Date();
    const tempDir = getTempDir();
    
    const expired = await prisma.galleryAsset.findMany({
      where: { expiresAt: { lte: now } }
    });

    if (expired.length > 0) {
      logger.info(`🧹 [WORKER] Found ${expired.length} expired gallery assets to purge.`);
      
      for (const asset of expired) {
        try {
          const filePath = path.join(/*turbopackIgnore: true*/ tempDir, asset.fileId);
          if (existsSync(filePath)) {
            await fs.unlink(filePath);
            logger.info(`🗑️ [WORKER] Deleted physical file: ${asset.fileId}`);
          }
          
          const metadataPath = path.join(/*turbopackIgnore: true*/ tempDir, `${asset.fileId}.metadata.json`);
          if (existsSync(metadataPath)) {
            await fs.unlink(metadataPath);
          }

          if (existsSync(tempDir)) {
            const files = await fs.readdir(tempDir);
            for (const file of files) {
               if (file.includes(asset.fileId) && file !== asset.fileId) {
                  await fs.unlink(path.join(/*turbopackIgnore: true*/ tempDir, file)).catch(() => {});
               }
            }
          }

          await prisma.galleryAsset.delete({ where: { id: asset.id } });
        } catch (err: unknown) {
          logger.error(`❌ [WORKER] Failed to purge asset ${asset.fileId}:`, err);
        }
      }
    }

    if (existsSync(tempDir)) {
      const files = await fs.readdir(tempDir);
      const dayAgo = now.getTime() - (24 * 60 * 60 * 1000);
      
      const trackedFileIds = new Set([
        ...(await prisma.galleryAsset.findMany({ select: { fileId: true } })).map(a => a.fileId),
        ...(await prisma.postActivity.findMany({ where: { stagedFileId: { not: null } }, select: { stagedFileId: true } })).map(p => p.stagedFileId!)
      ]);

      for (const file of files) {
        if (file === '.gitignore' || file === 'chunks') continue;
        const filePath = path.join(/*turbopackIgnore: true*/ tempDir, file);
        const stats = await fs.stat(filePath);
        if (stats.isFile() && stats.mtimeMs < dayAgo) {
           const isTracked = Array.from(trackedFileIds).some(id => file.includes(id));
           if (!isTracked) {
              await fs.unlink(filePath);
              logger.info(`🧹 [WORKER] Purged orphaned file: ${file}`);
           }
        }
      }
    }
  } catch (err) {
    logger.error("🧹 [WORKER] Asset purge failed:", err);
  }
}
