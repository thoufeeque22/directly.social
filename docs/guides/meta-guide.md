# Meta API Configuration (Facebook & Instagram)

Connecting your Facebook and Instagram accounts allows you to publish Reels and Posts directly from your vault. Like other platforms, you can Bring Your Own Key (BYOK) for Meta.

## Prerequisites

- A **Facebook Developer** account.
- A **Facebook Business Page** linked to an **Instagram Professional Account**.

## Getting Your Meta API Keys

1. Go to the **Meta for Developers** portal.
2. Click **Create App** and select **Other** -> **Business**.
3. **App Dashboard:**
   - Go to **Settings** -> **Basic**.
   - Copy your **App ID** and **App Secret**.
4. **Add Products:**
   - Add **Instagram Graph API**.
   - Add **Facebook Login for Business**.
5. **Configure Redirect URIs:**
   - In Facebook Login settings, add: `http://localhost:3000/api/auth/callback/facebook` (or your production URL).
6. **Permissions:**
   - Ensure your app has `instagram_basic`, `instagram_content_publish`, `pages_show_list`, and `pages_read_engagement`.

## Connecting to Directly Social

1. Open **Settings** -> **Destinations**.
2. Find **Instagram** or **Facebook** and click **Enable**.
3. Open **Advanced Settings (BYOK)**.
4. Paste your **App ID** and **App Secret**.
5. Click **Save Configuration**.
6. Now click **Connect Account** to link your specific page or Instagram profile.

Once connected, you can publish directly to Meta without any middleman servers!
