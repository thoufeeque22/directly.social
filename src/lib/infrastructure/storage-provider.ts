import { StorageProvider } from "../platforms/types";
import { resolveVideoPath } from "@/lib/worker/server-distributor.logic";
import path from "path";
import { promises as fs } from "fs";

/**
 * (CA-002): Implementation of StorageProvider for local filesystem.
 */
export class FileSystemStorageProvider implements StorageProvider {
  async resolvePath(stagedFileId: string, platform: string, activityId: string, accountId: string): Promise<string> {
    // Security (High): Sanitize stagedFileId to prevent path traversal
    const safeFileId = stagedFileId.replace(/[^a-zA-Z0-9_-]/g, "");
    const baseTmpPath = path.join(process.cwd(), "tmp", safeFileId);
    return resolveVideoPath(safeFileId, platform, activityId, accountId, baseTmpPath);
  }

  async getFileSize(filePath: string): Promise<number> {
    const { size } = await fs.stat(filePath);
    return size;
  }
}
