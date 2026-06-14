# Setting Up Your Video Storage

Directly Social is designed to give you total control over your media. Unlike other apps, we don't force you to upload your videos to our servers. Instead, you can keep them on your own device or connect your own private cloud storage.

## Why use your own storage?

- **Privacy:** Your videos stay in your control. We only access them when you click "Publish."
- **Quality:** No compression or "middleman" optimization. Your high-quality files are preserved.
- **Cost:** You don't pay us for storage. You can use free tiers from providers like Cloudflare or AWS.

## Connection Options

### 1. Local-Only (Default)
By default, Directly Social works with your local browser storage. This is perfect for quick posts and solo creators. No setup is required!

### 2. Private Cloud Storage (Bring Your Own Storage)
If you want to sync your media across devices or manage a large library, you can connect an S3-compatible bucket (like Cloudflare R2 or AWS S3).

**Basic Steps:**
1. Create a "Bucket" on your preferred provider.
2. Generate an **Access Key** and **Secret Key**.
3. Go to **Settings > Storage** in Directly Social and enter your details.

> **Technical Note:** For cloud storage to work correctly with a web app, you must enable **CORS** in your provider's settings. See our [Cloud Storage Guide (BYOS)](/docs/dev/vault-setup) for the exact settings.

Once connected, your "Media" tab will automatically sync with your private cloud!
