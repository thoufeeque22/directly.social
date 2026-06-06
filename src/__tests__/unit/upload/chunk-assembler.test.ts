/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { assembleChunks, UploadAssemblyError } from "@/lib/upload/chunk-assembler";
import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";
import { writeChunk } from "@/lib/upload/stream-utils";

vi.mock("fs", () => {
  const mockPromises = {
    mkdir: vi.fn().mockResolvedValue(undefined),
    readdir: vi.fn(),
    readFile: vi.fn(),
    unlink: vi.fn().mockResolvedValue(undefined),
    stat: vi.fn(),
    rmdir: vi.fn().mockResolvedValue(undefined),
  };
  const mockReadStream = {
    on: vi.fn(function(event, cb) {
      if (event === "data") cb(Buffer.from("chunk data"));
      if (event === "end") cb();
      return this;
    }),
  };
  return {
    promises: mockPromises,
    createWriteStream: vi.fn(),
    createReadStream: vi.fn().mockReturnValue(mockReadStream),
    default: {
      promises: mockPromises,
      createWriteStream: vi.fn(),
      createReadStream: vi.fn().mockReturnValue(mockReadStream),
    },
  };
});

vi.mock("@/lib/upload/stream-utils", () => ({
  writeChunk: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/core/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("chunk-assembler", () => {
  const uploadId = "test-upload-id";
  const fileName = "test-video.mp4";
  const totalChunks = 2;
  const baseDir = "/tmp/test";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should assemble chunks successfully", async () => {
    const chunkFiles = ["chunk-0", "chunk-1"];
    vi.mocked(fs.readdir).mockResolvedValue(chunkFiles as never);
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from("chunk data") as never);
    vi.mocked(fs.stat).mockResolvedValue({ size: 20 } as never);

    const mockWriteStream = {
      end: vi.fn(),
      on: vi.fn((event, cb) => {
        if (event === "finish") cb();
      }),
    };
    vi.mocked(fsSync.createWriteStream).mockReturnValue(mockWriteStream as any);

    const result = await assembleChunks(uploadId, fileName, totalChunks, 20, baseDir);

    expect(result.fileId).toBeDefined();
    expect(result.finalPath).toContain(baseDir);
    expect(result.size).toBe(20);

    expect(fs.readdir).toHaveBeenCalledWith(path.join(baseDir, "chunks", uploadId));
    expect(fs.readFile).toHaveBeenCalledTimes(2);
    expect(writeChunk).toHaveBeenCalledTimes(2);
    expect(fs.unlink).toHaveBeenCalledTimes(2); // Each chunk unlinked
    expect(fs.rmdir).toHaveBeenCalledWith(path.join(baseDir, "chunks", uploadId));
  });

  it("should throw error if chunk count mismatch", async () => {
    const chunkFiles = ["chunk-0"];
    (fs.readdir as any).mockResolvedValue(chunkFiles);

    await expect(assembleChunks(uploadId, fileName, totalChunks, 20, baseDir))
      .rejects.toThrow(UploadAssemblyError);
  });

  it("should throw error if integrity check fails", async () => {
    const chunkFiles = ["chunk-0", "chunk-1"];
    (fs.readdir as any).mockResolvedValue(chunkFiles);
    (fs.stat as any).mockResolvedValue({ size: 15 }); // Expected 20

    const mockWriteStream = {
      end: vi.fn(),
      on: vi.fn((event, cb) => {
        if (event === "finish") cb();
      }),
    };
    (fsSync.createWriteStream as any).mockReturnValue(mockWriteStream);

    await expect(assembleChunks(uploadId, fileName, totalChunks, 20, baseDir))
      .rejects.toThrow("Integrity Check Failed.");
    
    expect(fs.unlink).toHaveBeenCalled(); // Final path should be unlinked
  });
});
