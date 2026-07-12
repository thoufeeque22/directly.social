# Data Handling & Privacy Architecture

This document outlines how directly.social stores, processes, secures, and deletes user data. It serves as an internal reference for engineers, auditors, and compliance officers.

## 1. Data Inventory

directly.social processes and stores various categories of user data:

- **User Profiles & Identity:** Name, email address, avatar/image, OAuth tokens (Google/YouTube, TikTok, etc.), and platform preferences.
- **Sensitive Credentials:** API keys and client secrets for the Bring Your Own Key (BYOK) system, and S3/R2 storage access credentials for the Bring Your Own Storage (BYOS) system.
- **Content & Media:** Uploaded video assets (stored in S3/R2), generated metadata (titles, descriptions, tags), and AI-generated content styling preferences.
- **Operational Data:** Billing profiles (Stripe IDs, subscription tiers), session tokens, system audit logs, and support requests.

## 2. Storage & Security

We employ robust security measures for data at rest and data in transit:

### Data at Rest
- **Relational Database:** All relational data (users, metadata, billing profiles) is stored in PostgreSQL (e.g., Supabase). 
- **Object Storage:** User media assets are stored in S3-compatible object storage (AWS S3, Cloudflare R2).
- **Encryption:** Highly sensitive fields, particularly BYOK credentials (`ByokCredential.clientSecret`) and BYOS configurations (`ByosConfig.secretAccessKey`), are encrypted at rest using **AES-256-GCM** before being persisted to the database.

### Data in Transit
- All communication between the client (web/mobile apps) and the server is encrypted using standard **TLS 1.3** (enforced via Vercel/Cloudflare).
- Internal communications between our backend and third-party APIs (e.g., Stripe, SendGrid) strictly utilize HTTPS.

## 3. Data Retention & Deletion

We adhere to the principle of data minimization and allow users to exercise their Right to be Forgotten.

### Relational Data Deletion (Hard Deletes)
The database schema strictly employs Prisma's `onDelete: Cascade` mechanism. We do not use "soft deletes" (e.g., `deletedAt` flags) for core user records. 
- When a user deletes their account via `DELETE /api/settings/account`, the User record is physically deleted from the PostgreSQL database.
- The cascading rules ensure that all associated `Account`, `Session`, `ByokCredential`, `ByosConfig`, `GalleryAsset`, `PostActivity`, `BillingProfile`, and `TokenAuditLog` records are synchronously permanently deleted.

### Object Storage Deletion
Media assets require an explicit physical deletion step:
- Individual file deletions (`DELETE /api/media/[fileId]`) and bulk deletions invoke the S3 API to physically remove the object from the storage bucket alongside the database record.
- Background cleanup workers (`/api/upload/cleanup`) routinely purge orphaned staged files that are no longer referenced by a post or platform schedule.

## 4. Third-Party Subprocessors

directly.social utilizes several trusted third-party services that process or store limited subsets of user data:

- **Stripe:** Processes payments and manages billing profiles. We only store the `providerCustomerId` and subscription status locally.
- **Upstash (Redis):** Manages API rate-limiting to prevent abuse. IP addresses and User IDs are temporarily processed in memory to enforce limits.
- **Resend:** Delivers transactional emails and notifications.
- **Sentry:** Captures crash reports and application errors. May inadvertently process IP addresses or user IDs during error tracing.
- **AI Providers (OpenAI, Google Gemini, Anthropic, Groq):** Video metadata, transcripts, and styling prompts are transmitted to these providers for AI processing. User PII is strictly excluded from these prompts unless explicitly provided by the user in the content.
