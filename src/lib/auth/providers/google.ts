import { google } from "googleapis";

type GoogleCreds = { clientId?: string; clientSecret?: string; redirectUri?: string };

export async function refreshGoogleToken(refreshToken: string, credentials: GoogleCreds) {
  const oauth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    credentials.redirectUri
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials: tokens } = await oauth2Client.refreshAccessToken();
  
  return {
    access_token: tokens.access_token!,
    refresh_token: tokens.refresh_token || undefined,
    expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : undefined,
  };
}
