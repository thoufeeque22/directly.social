import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";
import { logger } from "@/lib/core/logger";
import { writeChunk } from "./stream-utils";

export class UploadAssemblyError extends Error {
  constructor(message: string) { super(message); this.name = "UploadAssemblyError"; }
}

export async function assembleChunks(
  uploadId: string,
  fileName: string,
  totalChunks: number,
  totalSize?: number,
  baseDir: string = process.env.UPLOAD_TEMP_DIR || path.join(process.cwd(), "tmp")
) {
  const chunkDir = path.join(baseDir, "chunks", path.basename(uploadId));
  const tempDir = baseDir;
  await fs.mkdir(tempDir, { recursive: true });

  const fileId = `${crypto.randomUUID()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const finalPath = path.join(tempDir, fileId);

  logger.info(`🧩 [ASSEMBLE] Joining ${totalChunks} chunks into: ${finalPath}`);
  const chunkFiles = (await fs.readdir(chunkDir)).sort();
  
  if (chunkFiles.length !== totalChunks) throw new UploadAssemblyError(`Chunk mismatch.`);

  const writeStream = fsSync.createWriteStream(finalPath);
  try {
    for (const chunkFile of chunkFiles) {
      const chunkPath = path.join(chunkDir, chunkFile);
      const chunkBuffer = await fs.readFile(chunkPath);
      await writeChunk(writeStream, chunkBuffer);
      await fs.unlink(chunkPath);
    }
  } finally {
    writeStream.end();
  }

  await new Promise<void>((res, rej) => { writeStream.on("finish", res); writeStream.on("error", rej); });

  const stats = await fs.stat(finalPath);
  if (totalSize && stats.size !== totalSize) {
    await fs.unlink(finalPath);
    throw new UploadAssemblyError(`Integrity Check Failed.`);
  }

  await fs.rmdir(chunkDir);
  return { fileId, finalPath, size: stats.size };
}
