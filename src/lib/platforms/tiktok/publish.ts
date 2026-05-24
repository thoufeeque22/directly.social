import { createReadStream } from "fs";

export const initTikTokPublish = async (accessToken: string, videoSize: number, title: string, privacy: string) => {
  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      post_info: { title, privacy_level: privacy, disable_duet: false, disable_comment: false, disable_stitch: false },
      source_info: { source: "FILE_UPLOAD", video_size: videoSize, chunk_size: videoSize, total_chunk_count: 1 },
    }),
  });

  const data = await res.json();
  if (data.error?.code !== "ok") throw new Error(`TikTok Init Failed: ${data.error?.message}`);
  return data.data;
};

export const pushTikTokBinary = async (uploadUrl: string, videoPath: string, videoSize: number) => {
  const stream = createReadStream(videoPath);
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4", "Content-Length": videoSize.toString(), "Content-Range": `bytes 0-${videoSize - 1}/${videoSize}` },
    body: stream as unknown as BodyInit,
    // @ts-expect-error - duplex is required for streaming bodies in Node fetch
    duplex: 'half'
  });

  if (!res.ok) throw new Error(`TikTok Upload Failed: ${res.status}`);
  return true;
};
