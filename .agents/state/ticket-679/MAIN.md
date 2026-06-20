---
ticket_id: 679
branch_name: feature/679-enhance-support-page-contact-form
status: discovery
current_round: 1
---

# 📋 Ticket Metadata
- **ID**: 679
- **Branch**: `feature/679-enhance-support-page-contact-form`
- **Goal**: Enhance settings support page, add contact form saving to DB, validate links
- **Current Status**: discovery

# 📝 Ticket Description
Enhance the existing `/settings?tab=support` page by adding a dedicated contact form that saves submissions to the database. Ensure all support links are valid. (Social media links will be handled in Phase 2).

## Requirements

### R1. Contact Form UI
Replace the existing email link with a functional contact form on the `/settings?tab=support` page. The form should collect necessary details (e.g., topic, message). It must use React 19 / Next.js 15 conventions (e.g., `action={...}` passing `FormData`), and have proper accessibility (labels for inputs).

### R2. Server Action & Database Storage
Create a Next.js Server Action to handle the form submission. The action must save the support request to the database (requiring a schema update/migration). Do not use the `any` type (enforce strict TypeScript).

### R3. Link Validation
Ensure any existing support or documentation links on the page are valid and functional.

## Acceptance Criteria

### R1 & R2 Verification (Programmatic)
- Agent team writes an automated test or verification script that successfully submits a mock form payload to the Server Action and verifies the data was saved to the database.
- The contact form displays a success state upon successful submission and clear error messages for invalid inputs (e.g., empty message).

### R3 Verification (Programmatic)
- Agent team writes a script or test to verify that all external links on the support page return a 200 HTTP status code.

# 🔄 Round History
- **Round 1**: [IN-PROGRESS]

# 📅 Timeline
- **2026-06-20 22:58:34**: Branch `feature/679-enhance-support-page-contact-form` created.
- **2026-06-20 22:58:45**: Ticket state initialized by Project Orchestrator.
- **2026-06-21 01:01:00**: PRODUCT [APPROVED] - Approved Product Spec: Defined UX flow, MUI layout, and accessibility for Support contact form
