# Internal User Credits

## Overview
The Internal User Credits system governs the usage of platform-managed AI models (e.g., Gemini or OpenAI accessed via the platform's API keys). It provides a mechanism to track, deduct, and limit AI usage per user to prevent abuse and manage costs, aligning with the platform's monetization strategy.

## Core Capabilities
- **Credit Balance (`aiCredits`)**: Each user has an `aiCredits` integer field in the database.
- **Credit Deduction**: Calling AI services deducts credits from the user's balance.
- **BYOK Bypass**: If a user has a valid Bring Your Own Key (BYOK) configuration for the chosen provider, their internal `aiCredits` are NOT deducted, as they are absorbing the API cost themselves.
- **Feature Flag / Bypass**: The credit deduction logic (`consumeAiCredit`) currently contains a temporary bypass (e.g., returning `true` without deducting credits) for development and initial testing. This ensures no friction during early beta phases while the infrastructure is in place for future activation.

## Technical Implementation
- **Schema**: The `User` model in `schema.prisma` includes `aiCredits Int @default(100)`.
- **Utility**: The `consumeAiCredit` utility in `src/lib/credits/credits.ts` checks the user's BYOK status and credit balance, orchestrating the deduction via a Prisma transaction if necessary.
- **API Integration**: AI-powered API routes (e.g., `/api/ai/enrich`) invoke `consumeAiCredit` before performing generation. If `consumeAiCredit` returns `false`, the API responds with a `403 Forbidden` (Insufficient Credits).

## Future Roadmap
- Enable the feature flag for production.
- Integrate with payment gateways (e.g., Stripe) to allow users to purchase additional credits.
- Display the user's credit balance in the UI.
