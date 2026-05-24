export const createInstagramContainer = async (
  igUserId: string,
  accessToken: string,
  caption: string,
  musicId?: string
) => {
  const url = `https://graph.facebook.com/v20.0/${igUserId}/media`;
  const body = {
    upload_type: "resumable",
    caption,
    media_type: "REELS",
    share_to_feed: true,
    access_token: accessToken,
    audio_id: musicId,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (data.error) throw new Error(`IG Step 1 Failed: ${data.error.message}`);
  return data.id;
};
