import { createReadStream } from "fs";

const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB chunk

export const initTikTokPublish = async (accessToken: string, videoSize: number, title: string, privacy: string) => {
  let chunk_size = videoSize;
  let total_chunk_count = 1;
  
  if (videoSize > 50 * 1024 * 1024) {
    chunk_size = CHUNK_SIZE;
    total_chunk_count = Math.ceil(videoSize / CHUNK_SIZE);
  }

  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      post_info: { title, privacy_level: privacy, disable_duet: false, disable_comment: false, disable_stitch: false },
      source_info: { source: "FILE_UPLOAD", video_size: videoSize, chunk_size, total_chunk_count },
    }),
  });

  const data = await res.json();
  if (data.error?.code !== "ok") throw new Error(`TikTok Init Failed: ${data.error?.message}`);
  return data.data;
};

export const pushTikTokBinary = async (uploadUrl: string, videoPath: string, videoSize: number) => {
  if (videoSize <= 50 * 1024 * 1024) {
    const stream = createReadStream(videoPath);
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "video/mp4", "Content-Length": videoSize.toString(), "Content-Range": `bytes 0-${videoSize - 1}/${videoSize}` },
      body: stream as unknown as BodyInit,
      // @ts-expect-error - duplex required
      duplex: 'half'
    });
    if (!res.ok) throw new Error(`TikTok Upload Failed: ${res.status}`);
    return true;
  }

  const totalChunks = Math.ceil(videoSize / CHUNK_SIZE);
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, videoSize);
    const stream = createReadStream(videoPath, { start, end: end - 1 });
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "video/mp4", "Content-Length": (end - start).toString(), "Content-Range": `bytes ${start}-${end - 1}/${videoSize}` },
      body: stream as unknown as BodyInit,
      // @ts-expect-error - duplex
      duplex: 'half'
    });
    if (!res.ok) throw new Error(`TikTok Chunk ${i + 1} Upload Failed: ${res.status}`);
  }
  return true;
};
