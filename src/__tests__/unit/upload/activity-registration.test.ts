import { describe, it, expect, vi, beforeEach } from "vitest";
import { upsertUploadActivity } from "@/lib/upload/activity-registration";
import { prisma } from "@/lib/core/prisma";

vi.mock("@/lib/core/prisma", () => ({
  prisma: {
    postActivity: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/upload/activity-helpers", () => ({
  buildInitialPlatformData: vi.fn().mockReturnValue([{ platform: "youtube", status: "pending" }]),
  getFinalScheduledAt: vi.fn().mockReturnValue(new Date("2024-12-25T10:00:00Z")),
}));

describe("activity-registration", () => {
  const params = {
    userId: "user-1",
    fileId: "file-1",
    fileName: "video.mp4",
    finalPath: "/tmp/video.mp4",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new activity if activityId is missing", async () => {
    await upsertUploadActivity(params);

    expect(prisma.postActivity.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        stagedFileId: "file-1",
      }),
    });
  });

  it("should update activity if activityId is provided", async () => {
    await upsertUploadActivity({ ...params, activityId: "act-1" });

    expect(prisma.postActivity.update).toHaveBeenCalledWith({
      where: { id: "act-1", userId: "user-1" },
      data: expect.objectContaining({
        stagedFileId: "file-1",
      }),
    });
  });
});
