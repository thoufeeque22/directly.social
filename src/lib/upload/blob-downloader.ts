import fsSync from "node:fs";
import path from "node:path";
import { Readable } from "stream";
import { finished } from "stream/promises";

export async function downloadVercelBlobToTemp(blobUrl: string, filePath: string): Promise<boolean> {
  // SSRF Protection: Only allow vercel-storage.com domains
  try {
    const parsed = new URL(blobUrl);
    if (!parsed.hostname.endsWith('.public.blob.vercel-storage.com')) {
      return false;
    }
  } catch {
    return false;
  }

  const res = await fetch(blobUrl);
  if (!res.ok || !res.body) {
    return false;
  }

  fsSync.mkdirSync(path.dirname(filePath), { recursive: true });
  const fileStream = fsSync.createWriteStream(filePath);
  await finished(Readable.fromWeb(res.body as unknown as import("stream/web").ReadableStream).pipe(fileStream));
  return true;
}
