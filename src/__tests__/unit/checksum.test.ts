import os from "os";
import { describe, it, expect, beforeEach } from "vitest";
import { calculateChecksum, calculateMetadataHash } from "../../lib/utils/checksum";
import fs from "fs";
import path from "path";

describe("Checksum Utility", () => {
  const testFile = path.join(os.tmpdir(), "directly_social", "test-checksum.txt");

  beforeEach(async () => {
    if (!fs.existsSync(path.dirname(testFile))) {
      fs.mkdirSync(path.dirname(testFile), { recursive: true });
    }
    fs.writeFileSync(testFile, "hello world");
  });

  it("should calculate correct SHA-256 hash for a file", async () => {
    const hash = await calculateChecksum(testFile);
    // sha256 of "hello world"
    expect(hash).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
  });

  it("should calculate correct MD5 hash for metadata object", () => {
    const metadata = { title: "Test", platform: "YouTube" };
    const hash = calculateMetadataHash(metadata);
    expect(hash).toBeDefined();
    expect(hash.length).toBe(32); // MD5 hex length
  });
});
