# Bringing Your Own Keys (BYOK)

To give you maximum freedom and bypass global rate limits, Directly Social allows you to **Bring Your Own Keys (BYOK)**. This means you connect your own developer accounts from TikTok and Google directly to the app.

## Benefits of BYOK

- **Unlimited Throughput:** You aren't shared with thousands of other users. You use your own project's quota.
- **Custom Branding:** When you connect an account, it will show *your* application name instead of "Directly Social."
- **Total Independence:** You own the relationship with the platform APIs.

## Supported Platforms

### 1. YouTube (via Google Cloud)
To get your keys for YouTube:
- Go to the **Google Cloud Console**.
- Create a new project.
- Enable the **YouTube Data API v3**.
- Configure the **OAuth Consent Screen** (set as External).
- Create **OAuth 2.0 Client IDs** (Web Application).
- **Authorized Redirect URI:** `http://localhost:3000/api/auth/callback/google` (or your production URL).
- Copy your **Client ID** and **Client Secret**.

### 2. TikTok (via TikTok for Developers)
To get your keys for TikTok:
- Go to the **TikTok for Developers** portal.
- Create a new app.
- Enable **Content Posting API** and **Video Kit**.
- Submit your app for review (TikTok requires this for production usage).
- Copy your **Client Key** and **Client Secret**.
- **Redirect URI:** `http://localhost:3000/api/auth/callback/tiktok` (or your production URL).

## How to Configure in Directly

1. Open **Settings** and go to the **Destinations** tab.
2. Find the platform you want to configure and click **Enable**.
3. Expand the **Advanced Settings (BYOK)** section.
4. Enter your Client ID/Key and Secret.
5. Click **Save Configuration**.

Once saved, the app will prioritize your personal keys for all future connection and publishing tasks!
