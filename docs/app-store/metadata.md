# App Store & Play Store Metadata

> **Source of truth for code:** [`src/lib/core/brand.ts`](../../src/lib/core/brand.ts)
> This document is a human-readable reference for non-technical team members and ASO planning.

---

## Apple App Store

| Field | Value | Limit |
|---|---|---|
| **Title** | directly.social | 30 chars |
| **Subtitle** | Schedule & Post Natively | 30 chars |

### Subtitle Rationale
- **"Schedule & Post"** — captures the two highest-volume ASO keywords in the social media tools category
- **"Natively"** — brand-specific differentiator tied to the tagline ("The Native Social Client"), implies direct platform access without middleware

### A/B Testing Alternatives
| Subtitle | Chars | Angle |
|---|---|---|
| "Your Keys. Your Content." | 25 | Bold ownership hook — strong for power users, weaker for ASO |
| "Own Your Content Pipeline" | 25 | Ownership + functional hybrid |

---

## Google Play Store

| Field | Value | Limit |
|---|---|---|
| **Title** | directly.social | 30 chars |
| **Short Description** | Schedule and publish to social media platforms — with your own keys and storage. | 80 chars |

### Short Description Rationale
- **Future-proof** — does not name specific platforms, stays accurate as integrations expand
- **"your own keys and storage"** — immediately differentiates from every competitor (Buffer, Hootsuite, Later)
- **Full sentence format** — Google Play renders this as a paragraph, so natural language reads better than tagline-style copy

---

## ASO Keywords (Reference)

High-value terms to target across both stores:

| Keyword | Search Volume | Relevance |
|---|---|---|
| social media scheduler | High | Core function |
| post scheduler | High | Core function |
| tiktok scheduler | Medium | Platform-specific |
| youtube upload | Medium | Platform-specific |
| content planner | Medium | Adjacent function |
| social media manager | High | Category term |
| BYOK / bring your own key | Low | Niche differentiator |

> **Note:** These keywords should be placed in the Apple **Keywords** field (100-char limit, comma-separated) and naturally within the Google Play **Full Description** (4000-char limit) — both of which are separate tasks from this ticket.
