/* eslint-disable max-lines */
import { createReadStream, promises as fs } from "fs";
import { Transform } from "stream";
import axios from "axios";
import { logger } from "@/lib/core/logger";

export const fetchMetaUploadOffset = async (
  uploadUrl: string,
  accessToken: string
) => {
  try {
    const res = await fetch(uploadUrl, {
      method: "GET",
      headers: { "Authorization": `OAuth ${accessToken}` }
    });
    if (res.ok) {
      const offset = res.headers.get("Offset");
      return offset ? parseInt(offset, 10) : 0;
    }
  } catch (err) {
    logger.warn(`[META-UPLOAD] Failed to fetch offset for ${uploadUrl}`, err);
  }
  return 0;
};

export const pushBinaryToMeta = async ({
  filePath,
  uploadUrl,
  accessToken,
  onProgress,
  startOffset = 0,
}: {
  filePath: string;
  uploadUrl: string;
  accessToken: string;
  onProgress?: (percent: number) => void;
  startOffset?: number;
}) => {
  const stats = await fs.stat(filePath);
  const fileSize = stats.size;

  if (startOffset >= fileSize) {
    logger.info(`[META-UPLOAD] File already fully uploaded to ${uploadUrl}`);
    return { success: true };
  }

  const fileStream = createReadStream(filePath, { start: startOffset });
  let bytesUploaded = startOffset;

  const progressStream = new Transform({
    transform(chunk, encoding, callback) {
      bytesUploaded += chunk.length;
      if (onProgress) onProgress((bytesUploaded / fileSize) * 100);
      callback(null, chunk);
    }
  });

  const response = await axios.post(uploadUrl, fileStream.pipe(progressStream), {
    headers: {
      "Authorization": `OAuth ${accessToken}`,
      "Offset": startOffset.toString(),
      "Content-Length": (fileSize - startOffset).toString(),
      "X-Entity-Length": fileSize.toString(),
      "X-Entity-Name": `video_${Date.now()}.mp4`,
      "X-Entity-Type": "video/mp4",
      "Content-Type": "application/octet-stream"
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 300000
  });

  if (!response.data || response.data.success === false) {
    throw new Error(`Meta Binary Push Failed: ${JSON.stringify(response.data)}`);
  }

  return response.data;
};
