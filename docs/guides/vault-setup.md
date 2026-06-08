# Setting Up Your Storage Vault (BYOS)

Directly Social is built on a "Privacy First" architecture. Unlike other social media tools, we don't force you to upload your videos to our servers. Instead, you can connect your own private storage—this is what we call **Bring Your Own Storage (BYOS)**.

## Why use your own storage?

- **Total Ownership:** Your original high-quality videos stay in your infrastructure.
- **No Extra Costs:** You don't pay us for storage or bandwidth. You pay your provider directly at wholesale rates.
- **Privacy:** We only stream your files during the brief moment of publishing.

## Supported Providers

We support any S3-compatible object storage. We recommend:
- **Cloudflare R2** (Highly recommended: zero egress fees means it's often the cheapest).
- **AWS S3**
- **Google Cloud Storage**
- **Backblaze B2**

## Step-by-Step Setup

1. **Create a Bucket:** Log into your storage provider (e.g., Cloudflare or AWS) and create a new "Bucket."
2. **Configure CORS:** This is the most important step. To allow Directly Social to upload directly from your browser to your bucket, you must enable **CORS (Cross-Origin Resource Sharing)**.
   - Use the following settings in your provider's CORS configuration:
     - Allowed Origins: `*` (or your specific domain)
     - Allowed Methods: `PUT`, `POST`, `GET`, `HEAD`
     - Allowed Headers: `*`
     - Expose Headers: `ETag`
3. **Get Your Keys:** Generate an **Access Key ID** and a **Secret Access Key** with read/write permissions for that bucket.
4. **Connect to Directly Social:**
   - Open **Settings** in Directly Social.
   - Navigate to the **Storage** tab.
   - Enter your Bucket Name, Region, Endpoint, and your Access Keys.
   - Click **Save Configuration**.

Once connected, every video you upload in the **Media** tab will go directly to your own vault!
