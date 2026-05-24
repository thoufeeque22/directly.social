export const finalizeInstagramPublish = async (
  igUserId: string,
  creationId: string,
  accessToken: string
) => {
  const url = `https://graph.facebook.com/v20.0/${igUserId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`;
  const res = await fetch(url, { method: "POST" });
  const data = await res.json();

  if (data.error) throw new Error(`IG Step 4 Failed: ${data.error.message}`);
  return data.id;
};

export const fetchInstagramPermalink = async (
  mediaId: string,
  accessToken: string
) => {
  const url = `https://graph.facebook.com/v20.0/${mediaId}?fields=permalink,shortcode&access_token=${accessToken}`;
  const res = await fetch(url);
  const data = await res.json();
  
  return data.permalink || (data.shortcode ? `https://www.instagram.com/reel/${data.shortcode}/` : null);
};
