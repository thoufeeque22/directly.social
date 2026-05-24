import { createReadStream } from "fs";
import { Transform } from "stream";

export const pushYouTubeBinary = async (
  uploadUrl: string,
  filePath: string,
  startByte: number,
  fileSize: number,
  onProgress?: (percent: number) => void
) => {
  const fileStream = createReadStream(filePath, { start: startByte });
  let bytesUploaded = startByte;

  const progressStream = new Transform({
    transform(chunk, encoding, callback) {
      bytesUploaded += chunk.length;
      if (onProgress) onProgress((bytesUploaded / fileSize) * 100);
      callback(null, chunk);
    }
  });

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Range": `bytes ${startByte}-${fileSize - 1}/${fileSize}` },
    body: fileStream.pipe(progressStream) as unknown as BodyInit,
    // @ts-expect-error - duplex is required for streaming bodies in Node fetch
    duplex: 'half'
  });

  if (!res.ok && res.status !== 308) {
    throw new Error(`YT Upload Failed: ${await res.text()}`);
  }

  return res.status === 308 ? null : await res.json();
};
