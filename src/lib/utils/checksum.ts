import crypto from "crypto";
import fs from "fs";

/**
 * Calculates a SHA-256 checksum for a file using streaming.
 * @param filePath Path to the file.
 * @returns Promise resolving to the hex-encoded checksum.
 */
export async function calculateChecksum(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", (error) => reject(error));
  });
}

/**
 * Calculates a hash for a generic metadata object.
 * Useful for tracking changes in platform-specific metadata.
 */
export function calculateMetadataHash(metadata: unknown): string {
  const content = JSON.stringify(metadata || {});
  return crypto.createHash("md5").update(content).digest("hex");
}
