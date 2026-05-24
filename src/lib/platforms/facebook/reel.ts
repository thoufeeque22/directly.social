export const initFacebookReel = async (pageId: string, accessToken: string) => {
  const res = await fetch(`https://graph.facebook.com/v22.0/${pageId}/video_reels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      upload_phase: "start",
      video_state: "PUBLISHED", 
      access_token: accessToken,
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(`Reel Init Failed: ${data.error.message}`);
  return data.video_id;
};

export const finalizeFacebookReel = async (
  pageId: string,
  videoId: string,
  description: string,
  accessToken: string
) => {
  const res = await fetch(`https://graph.facebook.com/v22.0/${pageId}/video_reels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      upload_phase: "finish",
      video_id: videoId,
      video_state: "PUBLISHED",
      description,
      access_token: accessToken,
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(`Reel Finish Failed: ${data.error.message}`);
  return data;
};
