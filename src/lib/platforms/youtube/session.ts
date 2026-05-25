import { youtube_v3 } from "googleapis";

interface YoutubeInternal {
  context: {
    _options: {
      auth: {
        getAccessToken?: () => Promise<{ token?: string | null } | string | null>;
        credentials?: { access_token?: string | null };
      }
    }
  }
}

export const initYouTubeSession = async (
  youtube: youtube_v3.Youtube,
  fileSize: number,
  metadata: youtube_v3.Schema$Video
) => {
  const authObj = (youtube as unknown as YoutubeInternal).context._options.auth;
  const authResult = typeof authObj?.getAccessToken === 'function' 
    ? await authObj.getAccessToken() 
    : null;
  
  let token: string | null | undefined;
  if (typeof authResult === 'string') {
    token = authResult;
  } else if (authResult && typeof authResult === 'object' && 'token' in authResult) {
    token = authResult.token;
  }
  
  if (!token) token = authObj?.credentials?.access_token;

  const res = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Upload-Content-Length": fileSize.toString(),
      "X-Upload-Content-Type": "video/*",
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) throw new Error(`YT Session Init Failed: ${await res.text()}`);
  const url = res.headers.get("Location");
  if (!url) throw new Error("Google did not return a resumable session URL.");
  return url;
};
