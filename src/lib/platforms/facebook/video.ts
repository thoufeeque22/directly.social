import { createReadStream } from "fs";

export const publishFacebookVideoDirect = async ({
  pageId, pageAccessToken, title, description, filePath
}: {
  pageId: string;
  pageAccessToken: string;
  title: string;
  description: string;
  filePath: string;
}) => {
  const fileStream = createReadStream(filePath);
  const formData = new FormData();
  
  formData.append("source", fileStream as unknown as Blob, "video.mp4");
  formData.append("title", title);
  formData.append("description", description);
  formData.append("access_token", pageAccessToken);

  const res = await fetch(`https://graph-video.facebook.com/v22.0/${pageId}/videos`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.error) throw new Error(`FB Video Push Failed: ${data.error.message}`);
  
  return { success: true, videoId: data.id };
};
