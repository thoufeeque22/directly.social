import { createReadStream, promises as fs } from "fs";
import { Transform } from "stream";
import axios from "axios";

export const pushBinaryToMeta = async ({
  filePath,
  uploadUrl,
  accessToken,
  onProgress,
}: {
  filePath: string;
  uploadUrl: string;
  accessToken: string;
  onProgress?: (percent: number) => void;
}) => {
  const stats = await fs.stat(filePath);
  const fileSize = stats.size;
  const fileStream = createReadStream(filePath);
  let bytesUploaded = 0;

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
      "Offset": "0",
      "Content-Length": fileSize.toString(),
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
