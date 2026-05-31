# Ticket #401: Unique Page Titles

## Status
- [x] Branch Initialization
- [x] Discovery (Research & Specification)
- [x] Development
- [ ] Review
- [ ] QA
- [ ] Documentation

## Context
- **Issue:** https://github.com/thoufeeque22/social-studio-app/issues/401
- **Goal:** Ensure every primary view (Dashboard, History, Schedule, Settings) has its own unique HTML page title.

## Discovery Notes
- Identified all primary routes and their metadata status.
- Next.js 15 Metadata API used for title injection.
- Split several components to allow server-side metadata exports on client-heavy pages.

## Plan
1. [x] Identify all primary routes.
2. [x] Define a metadata strategy (using Next.js Metadata API).
3. [x] Implement unique titles for each page.
4. [x] Verify browser tab labels and SEO metadata (Verified via `npm run build`).
