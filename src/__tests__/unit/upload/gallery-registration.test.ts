/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerGalleryAsset } from "@/lib/upload/gallery-registration";
import { prisma } from "@/lib/core/prisma";

vi.mock("@/lib/core/prisma", () => ({
  prisma: {
    galleryAsset: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("gallery-registration", () => {
  const params = {
    userId: "user-1",
    fileId: "file-1",
    fileName: "video.mp4",
    size: 1024,
    finalPath: "/tmp/video.mp4",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new gallery asset if it doesn't exist", async () => {
    vi.mocked(prisma.galleryAsset.findFirst).mockResolvedValue(null);

    await registerGalleryAsset(params);

    expect(prisma.galleryAsset.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        fileId: "file-1",
        fileName: "video.mp4",
        fileSize: BigInt(1024),
      }),
    });
  });

  it("should update existing gallery asset if it exists", async () => {
    const existingAsset = { id: "existing-id" } as any;
    vi.mocked(prisma.galleryAsset.findFirst).mockResolvedValue(existingAsset);

    await registerGalleryAsset(params);

    expect(prisma.galleryAsset.update).toHaveBeenCalledWith({
      where: { id: "existing-id" },
      data: expect.objectContaining({
        fileId: "file-1",
      }),
    });
    expect(prisma.galleryAsset.create).not.toHaveBeenCalled();
  });
});
