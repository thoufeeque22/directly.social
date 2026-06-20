# Discovery Blueprint: Settings Support Page Enhancement (Ticket 679)

**Verdict**: APPROVED
**Date**: 2026-06-21

## 1. Technical Blueprint
*   **Prisma Schema Updates**:
    *   Add a new `SupportRequest` model with fields: `id`, `userId`, `topic`, `message`, `createdAt` (DateTime @default(now())), and `updatedAt` (DateTime @updatedAt).
    *   Relate `SupportRequest` to the `User` model (one-to-many).
    *   Generate the Prisma client.
*   **Frontend (UI)**:
    *   Modify `/settings?tab=support` (or the corresponding Support card component) to include the new contact form.
    *   Use `useSession()` from next-auth on the client-side to retrieve and display the user's email address in a non-editable, subtle typography element.
    *   Implement character counting (max 1000 chars) and real-time basic validation on the `message` field.
    *   Implement an in-place success state component using MUI components (CheckCircleOutlineIcon, strict adherence to no-emojis rule).
*   **Backend (Server Actions)**:
    *   Create a Server Action to handle form submission.
    *   Wrap the action using the existing `protectedAction` helper from `src/lib/core/action-utils.ts` to guarantee authentication and extract the `userId`.
    *   Implement input validation using a Zod schema (topic must be one of the predefined enums, message length 10-1000 characters).
    *   Implement rate limiting using the existing `@upstash/ratelimit` setup to prevent spam submissions.
    *   Save the request to the database using Prisma.

## 2. Test Specification
*   **Manual QA**:
    *   Verify the form accurately displays the authenticated user's email.
    *   Verify client-side validation prevents submission of empty messages or messages >1000 characters, and disables the submit button appropriately.
    *   Verify successful submission correctly swaps the UI to the success state card.
    *   Verify rate limiting functions correctly by attempting multiple rapid submissions.
*   **Automated QA**:
    *   Write a Playwright script to simulate a form submission, verifying the success state UI is rendered.
    *   Write a Playwright test to crawl the `/settings?tab=support` page, extract all anchor (`<a>`) tags, perform an HTTP GET/HEAD request for each, and assert they all return a 200 OK status code.
