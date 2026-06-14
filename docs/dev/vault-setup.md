# Technical Vault Setup (BYOS)

This guide provides the exact technical specifications required to connect an S3-compatible storage bucket to Directly Social. For a high-level overview of storage options, see the [User Storage Guide](/docs/user/storage-setup).

## S3 Compatibility Requirements

Directly Social uses the standard S3 protocol. Your provider must support:
- **SigV4 Authentication**
- **Multipart Uploads**
- **Public/Private ACLs** (Directly Social typically uses private buckets with presigned URLs).

## CORS (Cross-Origin Resource Sharing)

Since Directly Social is a web application, your storage bucket **must** allow cross-origin requests from the browser. Without correct CORS settings, uploads will fail with a "Network Error."

**Required CORS Configuration (JSON):**
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```
> **Security Tip:** For production, replace `"*"` in `AllowedOrigins` with your actual application domain (e.g., `https://app.directly.social`).

## IAM / Access Policy

The API keys you provide must have at least the following permissions on the target bucket:
- `s3:PutObject`
- `s3:GetObject`
- `s3:DeleteObject`
- `s3:ListBucket` (Optional, but recommended for library browsing)

## Provider Specifics

- **Cloudflare R2:** Ensure you use the "S3 API" endpoint provided in the R2 dashboard, not the public bucket URL.
- **AWS S3:** Ensure the region in your configuration matches the physical region of your bucket.
- **Backblaze B2:** You must use the S3-compatible API keys and endpoint.

Once configured, enter these details in **Settings > Storage** to enable your private vault.
