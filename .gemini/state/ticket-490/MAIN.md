# Ticket 490: Privacy Policy & Terms of Service

## Status
- **Phase:** QA
- **Status:** In Progress
- **Approval:** Pending

## Overview
Created public-facing legal pages required for final OAuth app audits by Google, TikTok, and Meta.

## Completed Tasks
- [x] Researched 2026 legal requirements for Google, TikTok, and Meta.
- [x] Created `src/app/(legal)/layout.tsx` for shared legal page styling.
- [x] Implemented `src/app/(legal)/privacy/page.tsx` with mandatory Google API Disclosure and Limited Use clauses.
- [x] Implemented `src/app/(legal)/terms/page.tsx` with platform-specific usage terms.
- [x] Implemented `src/app/(legal)/cookies/page.tsx`.
- [x] Updated `src/components/layout/LayoutWrapper.tsx` to allow unauthenticated public access to legal routes.
- [x] Verified existing links in Footer and Profile menu are functional.

## Public URLs
- `/privacy`
- `/terms`
- `/cookies`

## Strategy
- Used a clean, MUI-based layout to ensure high readability and platform compliance.
- Centrally managed legal routes in `LayoutWrapper` to bypass authentication.

## Verification Plan
- [x] Verified pages are accessible at `/privacy`, `/terms`, and `/cookies`.
- [x] Confirmed responsive design and brand alignment.
- [x] Ensured all required platform-specific clauses are present for audits.
