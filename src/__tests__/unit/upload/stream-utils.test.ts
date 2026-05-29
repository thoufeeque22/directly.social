/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { writeChunk } from "@/lib/upload/stream-utils";
import { EventEmitter } from "events";
import * as fsSync from "fs";

describe("stream-utils", () => {
  it("should resolve immediately if stream.write returns true", async () => {
    const mockStream = {
      write: vi.fn().mockReturnValue(true),
    };
    
    await expect(writeChunk(mockStream as unknown as fsSync.WriteStream, Buffer.from("test"))).resolves.toBeUndefined();
    expect(mockStream.write).toHaveBeenCalledWith(Buffer.from("test"));
  });

  it("should resolve on 'drain' if stream.write returns false", async () => {
    const mockStream = new EventEmitter();
    (mockStream as any).write = vi.fn().mockReturnValue(false);
    
    const promise = writeChunk(mockStream as unknown as fsSync.WriteStream, Buffer.from("test"));
    
    mockStream.emit("drain");
    
    await expect(promise).resolves.toBeUndefined();
  });

  it("should reject on 'error' if stream.write returns false", async () => {
    const mockStream = new EventEmitter();
    (mockStream as any).write = vi.fn().mockReturnValue(false);
    
    const promise = writeChunk(mockStream as unknown as fsSync.WriteStream, Buffer.from("test"));
    
    const error = new Error("stream error");
    mockStream.emit("error", error);
    
    await expect(promise).rejects.toThrow("stream error");
  });
});
