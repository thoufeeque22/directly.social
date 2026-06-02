import { prisma } from "@/lib/core/prisma";
import { logger } from "@/lib/core/logger";
import { existsSync, promises as fs } from "fs";
import path from "path";
import { calculateChecksum } from "@/lib/utils/checksum";

export class AuditService {
  private static getStoragePath(fileId: string) {
    const base = process.env.UPLOAD_TEMP_DIR || path.join(process.cwd(), "tmp");
    return path.join(base, fileId);
  }

  /**
   * Verify that all GalleryAssets and staged PostActivity files exist in physical storage.
   */
  static async verifyStorageIntegrity() {
    logger.info("🕵️ [AUDIT] Starting Storage Integrity Check...");
    let missingCount = 0;

    const assets = await prisma.galleryAsset.findMany({ select: { id: true, fileId: true, fileName: true } });
    for (const asset of assets) {
      if (!existsSync(this.getStoragePath(asset.fileId))) {
        logger.warn(`⚠️ [AUDIT] Missing physical file for GalleryAsset: ${asset.fileName} (${asset.fileId})`);
        missingCount++;
      }
    }

    const staged = await prisma.postActivity.findMany({ 
      where: { stagedFileId: { not: null } },
      select: { id: true, stagedFileId: true, title: true }
    });
    for (const post of staged) {
      if (!existsSync(this.getStoragePath(post.stagedFileId!))) {
        logger.warn(`⚠️ [AUDIT] Missing staged file for PostActivity: ${post.title} (${post.stagedFileId})`);
        missingCount++;
      }
    }

    await prisma.systemMetric.create({ data: { name: "audit.missing_files", value: missingCount } });
    return missingCount;
  }

  /**
   * Verify checksums for a batch of assets to detect bit rot or unauthorized modifications.
   */
  static async verifyChecksums(limit = 100) {
    logger.info(`🕵️ [AUDIT] Starting Checksum Verification (Limit: ${limit})...`);
    let mismatchCount = 0;

    const assets = await prisma.galleryAsset.findMany({
      where: { checksum: { not: null } },
      take: limit,
      orderBy: { createdAt: "desc" }
    });

    for (const asset of assets) {
      const actualPath = this.getStoragePath(asset.fileId);
      if (existsSync(actualPath)) {
        const actualChecksum = await calculateChecksum(actualPath);
        if (actualChecksum !== asset.checksum) {
          logger.error(`❌ [AUDIT] Checksum mismatch for ${asset.fileName}: Expected ${asset.checksum}, got ${actualChecksum}`);
          mismatchCount++;
        }
      }
    }

    await prisma.systemMetric.create({ data: { name: "audit.checksum_mismatches", value: mismatchCount } });
    return mismatchCount;
  }

  /**
   * Identifies PostPlatformResult entries that lack a valid parent or reference.
   */
  static async findOrphanedRecords() {
    logger.info("🕵️ [AUDIT] Checking for orphaned records...");
    
    // Simple orphan check: PlatformResults without parent Activity (Prisma handles Cascade, but logic might drift)
    const results = await prisma.postPlatformResult.findMany({
      include: { postActivity: true }
    });
    
    const orphans = results.filter(r => !r.postActivity);
    if (orphans.length > 0) {
      logger.warn(`⚠️ [AUDIT] Found ${orphans.length} orphaned PostPlatformResult records.`);
    }

    await prisma.systemMetric.create({ data: { name: "audit.orphaned_records", value: orphans.length } });
    return orphans.length;
  }

  static async runFullAudit() {
    const missing = await this.verifyStorageIntegrity();
    const mismatches = await this.verifyChecksums();
    const orphans = await this.findOrphanedRecords();
    
    logger.info(`✅ [AUDIT] Audit Completed. Missing: ${missing}, Mismatches: ${mismatches}, Orphans: ${orphans}`);
  }
}
