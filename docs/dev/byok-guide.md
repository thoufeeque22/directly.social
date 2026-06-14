# Bringing Your Own Keys (BYOK)

To give you maximum freedom and bypass global rate limits, Directly Social allows you to **Bring Your Own Keys (BYOK)**. This means you connect your own developer accounts directly to the app.

**Quick Navigation:**
- [YouTube Configuration](#1-youtube-via-google-cloud)
- [TikTok Configuration](#2-tiktok-via-tiktok-for-developers)
- [Meta (Facebook & Instagram) Configuration](#3-meta-facebook--instagram)
- [AI Providers (OpenAI & Gemini)](#4-ai-providers-openai--gemini)
- [How to Configure in Directly Social](#how-to-configure-in-directly-social)

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
- **Authorized Redirect URI:** `https://directly.social/api/auth/callback/google`
- Copy your **Client ID** and **Client Secret**.

### 2. TikTok (via TikTok for Developers)
To get your keys for TikTok:
- Go to the **TikTok for Developers** portal.
- Create a new app.
- Enable **Content Posting API** and **Video Kit**.
- Submit your app for review.
- Copy your **Client Key** and **Client Secret**.
- **Redirect URI:** `https://directly.social/api/auth/callback/tiktok`

### 3. Meta (Facebook & Instagram)
To publish Reels and Posts, you need a **Facebook Business Page** linked to an **Instagram Professional Account**.
- Go to the **Meta for Developers** portal.
- Click **Create App** and select **Other** -> **Business**.
- Under **Settings** -> **Basic**, copy your **App ID** and **App Secret**.
- Add the products: **Instagram Graph API** and **Facebook Login for Business**.
- In Facebook Login settings, add the **Redirect URI:** `https://directly.social/api/auth/callback/facebook`
- Ensure your app requests: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, and `pages_read_engagement`.

## How to Configure in Directly Social

1. Open **Settings** and go to the **Destinations** tab.
2. Find the platform you want to configure and click **Enable**.
3. Expand the **Advanced Settings (BYOK)** section.
4. Enter your Client ID/Key and Secret.
5. Click **Save Configuration**.

Once saved, the app will prioritize your personal keys for all future connection and publishing tasks!
figure in Directly Social

### For Social Platforms (YouTube, TikTok, Meta)
1. Open **Settings** and go to the **Destinations** tab.
2. Find the platform you want to configure and click **Enable**.
3. Expand the **Advanced Settings (BYOK)** section.
4. Enter your Client ID/Key and Secret.
5. Click **Save Configuration**.

### For AI Providers (OpenAI, Gemini)
1. Open **Settings** and go to the **AI** tab.
2. Select your preferred provider.
3. Enter your API Key.
4. Click **Connect Provider**.

Once saved, the app will prioritize your personal keys for all future connection, publishing, and AI tasks!
