import fsSync from "node:fs";
import path from "node:path";
import { Readable } from "stream";
import { finished } from "stream/promises";

export async function downloadVercelBlobToTemp(blobUrl: string, filePath: string): Promise<boolean> {
  // SSRF Protection: Allow vercel blob and Cloudflare R2 / Custom Domains
  try {
    const parsed = new URL(blobUrl);
    const r2PublicHost = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : '';
    if (
      !parsed.hostname.endsWith('.public.blob.vercel-storage.com') &&
      !parsed.hostname.endsWith('.r2.dev') &&
      (!r2PublicHost || parsed.hostname !== r2PublicHost)
    ) {
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
