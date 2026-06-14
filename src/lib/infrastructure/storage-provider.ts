import { StorageProvider } from "../platforms/types";
import { resolveVideoPath } from "@/lib/worker/server-distributor.logic";
import path from "path";

/**
 * (CA-002): Implementation of StorageProvider for local filesystem.
 */
export class FileSystemStorageProvider implements StorageProvider {
  async resolvePath(stagedFileId: string, platform: string, activityId: string, accountId: string): Promise<string> {
    const baseTmpPath = path.join(process.cwd(), "tmp", stagedFileId);
    return resolveVideoPath(stagedFileId, platform, activityId, accountId, baseTmpPath);
  }
}
