import axios from "axios";

type TikTokCreds = { clientId?: string; clientSecret?: string };

export async function refreshTikTokToken(refreshToken: string, credentials: TikTokCreds) {
  const response = await axios.post(
    "https://open.tiktokapis.com/v2/oauth/token/",
    new URLSearchParams({
      client_key: credentials.clientId || "",
      client_secret: credentials.clientSecret || "",
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { data } = response;
  if (data.error) throw new Error(`TikTok error: ${data.error_description || data.error}`);

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 0),
  };
}
