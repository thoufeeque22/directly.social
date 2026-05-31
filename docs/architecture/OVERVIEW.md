# Architectural Overview

## System Overview

Social Studio is a multi-platform social media management application that allows users to schedule and distribute video content (Shorts/Reels/TikToks) across various platforms simultaneously.

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
