import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuditService } from "../../lib/services/audit-service";
import { prisma } from "../../lib/core/prisma";
import fs from "fs";
import { calculateChecksum } from "../../lib/utils/checksum";

vi.mock("../../lib/core/prisma", () => ({
  prisma: {
    galleryAsset: {
      findMany: vi.fn(),
    },
    postActivity: {
      findMany: vi.fn(),
    },
    postPlatformResult: {
      findMany: vi.fn(),
    },
    systemMetric: {
      create: vi.fn(),
    },
  },
}));

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    default: {
      ...(actual.default as Record<string, unknown>),
      existsSync: vi.fn(),
    },
    existsSync: vi.fn(),
  };
});

vi.mock("../../lib/utils/checksum", () => ({
  calculateChecksum: vi.fn(),
}));

describe("AuditService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default existsSync to true to avoid breaking logger etc.
    (fs.existsSync as vi.Mock).mockReturnValue(true);
  });

  it("should detect missing files in storage integrity check", async () => {
    vi.mocked(prisma.galleryAsset.findMany).mockResolvedValue([
      { id: "1", fileId: "missing-1", fileName: "video1.mp4" } as never,
      { id: "2", fileId: "exists-1", fileName: "video2.mp4" } as never,
    ]);
    vi.mocked(prisma.postActivity.findMany).mockResolvedValue([]);
    
    (fs.existsSync as vi.Mock).mockImplementation((path: string) => path.endsWith("exists-1"));

    const missingCount = await AuditService.verifyStorageIntegrity();
    
    expect(missingCount).toBe(1);
    expect(prisma.systemMetric.create).toHaveBeenCalledWith({
      data: { name: "audit.missing_files", value: 1 }
    });
  });

  it("should detect checksum mismatches", async () => {
    vi.mocked(prisma.galleryAsset.findMany).mockResolvedValue([
      { id: "1", fileId: "file-1", fileName: "video1.mp4", checksum: "expected-hash" } as never,
    ]);
    
    (fs.existsSync as vi.Mock).mockReturnValue(true);
    vi.mocked(calculateChecksum).mockResolvedValue("wrong-hash");

    const mismatchCount = await AuditService.verifyChecksums();
    
    expect(mismatchCount).toBe(1);
    expect(prisma.systemMetric.create).toHaveBeenCalledWith({
      data: { name: "audit.checksum_mismatches", value: 1 }
    });
  });

  it("should find orphaned records", async () => {
    vi.mocked(prisma.postPlatformResult.findMany).mockResolvedValue([
      { id: "1", postActivity: {} } as never,
      { id: "2", postActivity: null } as never,
    ]);

    const orphanCount = await AuditService.findOrphanedRecords();
    
    expect(orphanCount).toBe(1);
    expect(prisma.systemMetric.create).toHaveBeenCalledWith({
      data: { name: "audit.orphaned_records", value: 1 }
    });
  });
});
