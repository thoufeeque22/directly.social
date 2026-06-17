# Architectural Overview

## System Overview

Directly is a multi-platform social media management application that allows users to schedule and distribute video content (Shorts/Reels/TikToks) across various platforms simultaneously.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Authentication:** [Auth.js (NextAuth)](https://authjs.dev/)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Validation:** [Zod](https://zod.dev/) (Runtime & API validation)
- **Rate Limiting:** [Upstash Redis](https://upstash.com/)
- **Video Processing:** [FFmpeg](https://ffmpeg.org/) (via `fluent-ffmpeg`)
- **Mobile Wrapper:** [Capacitor](https://capacitorjs.com/) (iOS & Android)
- **Monitoring:** [Sentry](https://sentry.io/)
- **Styling:** Vanilla CSS, Framer Motion, Lucide React

## Core Architecture Patterns

### 1. Root Layout Orchestration

The application utilizes a dynamic root path (`/`) that adapts its layout based on the user's authentication state:

- **Unauthenticated View:** Renders the marketing landing page, manually wrapped in the `LandingHeader` and `LandingFooter` to provide a high-conversion entry point.
- **Authenticated View:** Renders the primary dashboard view. The `LayoutWrapper.tsx` component acts as the central shell, automatically displaying the **Sidebar** and **App Header** (search, user profile) for authenticated users on the root path.
- **Benefits:** This architectural isolation ensures that marketing assets and productive workspace components never overlap, maintaining a clean "Zen Layout" for content creators.
