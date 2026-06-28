# Data Model

The application uses a relational database schema managed by Prisma.

```mermaid
erDiagram
    User ||--o{ Account : "has"
    User ||--o{ Session : "has"
    User ||--o{ PlatformPreference : "defines"
    User ||--o{ PostActivity : "creates"
    User ||--o{ GalleryAsset : "uploads"
    User ||--o{ TokenAuditLog : "logs"
    User ||--o{ MetadataTemplate : "saves"
    User ||--o{ UserSeenUpdate : "tracks"
    User ||--o{ Notification : "receives"
    User ||--o{ ByokCredential : "configures"
    User ||--o| ByosConfig : "configures"
    User ||--o| BillingProfile : "has"
    User ||--o{ SupportRequest : "submits"
    UpdateLog ||--o{ UserSeenUpdate : "logs"

    Account ||--o{ TokenAuditLog : "audited by"

    PostActivity ||--o{ PostPlatformResult : "distributes to"

    User {
        string id PK
        string name
        string email
        datetime emailVerified
        string image
        string preferredVideoFormat
        string preferredAIStyle
        string preferredAIStyleMode
        string preferredAIProvider
        string role
        string preferredTheme
        int aiCredits
    }

    MetadataTemplate {
        string id PK
        string userId FK
        string name
        string content
        datetime createdAt
        datetime updatedAt
    }

    Account {
        string id PK
        string userId FK
        string type
        string provider
        string providerAccountId
        string refresh_token
        string access_token
        int expires_at
        string token_type
        string scope
        string id_token
        string session_state
        string accountName
        boolean isDistributionEnabled
    }

    PostActivity {
        string id PK
        string userId FK
        string title
        string description
        string videoFormat
        datetime scheduledAt
        boolean isPublished
        string stagedFileId
        datetime createdAt
    }

    PostPlatformResult {
        string id PK
        string postActivityId FK
        string platform
        string accountName
        string accountId
        string platformPostId
        string permalink
        string status
        string errorMessage
        string resumableUrl
        string videoId
        string creationId
        string transcodeStatus
        string optimizedFileId
        json metadata
        string metadataHash
        int progress
        int retryCount
        datetime lastRetryAt
        datetime createdAt
        string overrideTitle
        string overrideDescription
        string hashtags
        string firstCommentText
        datetime scheduledAt
        int lastOffset
        string currentStep
    }

    GalleryAsset {
        string id PK
        string userId FK
        string fileId UK
        string fileName
        bigint fileSize
        string mimeType
        string processingStatus
        json metadata
        datetime expiresAt
        datetime createdAt
    }

    UpdateLog {
        string id PK
        string version
        string title
        string description
        datetime createdAt
    }

    UserSeenUpdate {
        string id PK
        string userId FK
        string updateId FK
        datetime seenAt
    }

    Notification {
        string id PK
        string userId FK
        string type
        string message
        boolean isRead
        string link
        datetime createdAt
    }
```

## Additional Models

- **ByokCredential:** Stores Bring-Your-Own-Key API credentials for users (e.g., OpenAI, Anthropic keys).
- **ByosConfig:** Stores Bring-Your-Own-Storage configurations for users (e.g., custom S3 or R2 buckets).
- **BillingProfile:** Tracks the user's subscription tier and billing status (e.g., via Stripe).
- **SupportRequest:** User-submitted support tickets and messages.
- **SystemBilling:** Tracks global system spending and thresholds for API providers.
- **SystemMetric:** Logs system-wide performance and usage metrics.
