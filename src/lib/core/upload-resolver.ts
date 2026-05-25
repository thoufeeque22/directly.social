import { NextRequest } from "next/server";
import path from "node:path";
import { streamMultipartFormData } from "@/lib/upload/streaming-parser";

export async function resolveUploadRequest(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const fields = await req.json();
    const isByos = fields.stagedFileId?.startsWith("byos_");
    const filePath = fields.stagedFileId ? path.join(process.cwd(), "tmp", path.basename(fields.stagedFileId)) : undefined;
    return { fields, isByos, filePath };
  }
  const parsed = await streamMultipartFormData(req);
  return { fields: parsed.fields, isByos: false, filePath: parsed.filePath };
}
