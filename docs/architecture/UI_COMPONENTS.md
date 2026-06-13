# UI & Feature Components

## 1. AI Chatbot Assistant

The AI Chatbot provides a conversational interface for users to manage their content, schedule posts, and view staged media. It leverages the Vercel AI SDK to stream responses and execute server-side tools.

```mermaid
sequenceDiagram
    participant U as User (UI)
    participant API as Chat API (/api/chat)
    participant LLM as AI Provider (Gemini/Ollama)
    participant DB as Database (Prisma)

    U->>API: Send Message
    API->>LLM: Send Context & Tools
    LLM-->>API: Stream Response / Tool Call
    
    rect rgb(240, 240, 240)
        note right of API: If Tool Call (e.g., schedule_video)
        API->>DB: Execute Server Action
        DB-->>API: Return Result
        API->>LLM: Send Tool Result
        LLM-->>API: Stream Final Summary
    end
    
    API-->>U: Stream UI Updates
```

## 2. Global Search

A unified search mechanism provides server-side filtering for activity and media assets.

```mermaid
sequenceDiagram
    participant U as User (UI)
    participant C as SearchField (Component)
    participant API as API (/api/activity or /api/media)
    participant DB as Database (Prisma)

    U->>C: Type search term
    C->>C: Debounce (500ms)
    C->>API: GET /api/... ?search=term
    API->>DB: Query with 'contains' (insensitive)
    DB-->>API: Filtered Results
    API-->>U: Render Results
```

## 3. Platform BYOK (Bring Your Own Key)

The BYOK Integration Wizard allows power users to provide their own platform API credentials (Client ID, Secret, Redirect URI), bypassing global application-level rate limits.

- **Implementation:** Leverages hardened **Next.js 15 Server Actions** (`validateAndSaveByokAction`) for credential validation and persistence.
- **Storage:** Credentials are persisted in the database using the `ByokCredential` model. The `clientSecret` is encrypted at rest using AES-256-GCM.
- **Credential Resolution:** A centralized `CredentialProvider` utility (`src/lib/core/credential-provider.ts`) manages the resolution of credentials, prioritizing user-provided BYOK keys.

## 4. Bring Your Own Storage (BYOS)

Users can connect their own S3/R2 storage to bypass server limits.

- **Orchestration:** Managed via hardened **Server Actions** (`saveByosConfigAction`) that perform multi-stage validation checks (Encryption, Bucket Access, Permissions).
- **Direct Upload:** Browser uploads directly to the user's bucket using presigned URLs.
- **Streaming Distribution:** Media is streamed directly from the user's bucket to platform APIs during publishing.

## 5. Global Refresh Mechanism

Directly implements a unified refresh system to ensure data consistency between server-side state and client-side components.

- **Centralized Logic:** The `useAppRefresh` hook handles the orchestration of `router.refresh()` (for server components) and the dispatching of custom events (for client components).
- **Event Synchronization:** Components can synchronize their state by listening to the `app:refresh` event on `globalThis`.
- **Mobile Gestures:** The system is integrated with a "Pull-to-Refresh" mechanism in the `LayoutWrapper`.

## 6. Activity Domain Architecture

The Activity domain manages the record of all past and upcoming posts.

- **Decomposed Server Actions:** Logic for fetching, retrying, and canceling activity items is split into specialized modules within `src/app/actions/activity/`.
- **Specialized Hooks:** A composite `useActivity` hook orchestrates multiple sub-hooks to manage complex state and logic (filters, pagination, data storage, adaptive polling).
- **Optimistic UI & Reconciliation**: The `useActivity` hook centralizes the logic for merging active "pending" posts with historical data.

## 7. Complex UI Form Architecture (Modular Engine)

Complex forms (like the Upload Form) follow a "Modular Engine" pattern to manage deep state and UI complexity while adhering to the 100-line rule.

- **Provider-Consumer Pattern:** The form is wrapped in a dedicated `UploadFormProvider` (Context) that consolidates state from props, custom hooks, and local signals.
- **Atomic Decomposition:** Large forms are broken down into a hierarchy of atomic, single-responsibility components.

## 8. Standard View Pattern (Server Shell / Client Content)

To optimize for SEO (Metadata API) and maintain strict modularity (100-line rule), all primary views follow a standard decomposition pattern:

- **Server Shell (`page.tsx`):** A server component that exports static or dynamic `metadata`, handles initial server-side auth/data fetching, and renders a `Suspense` boundary around the client content.
- **Client Content (`*Content.tsx`):** A focused client component (marked with `'use client'`) that manages interactive state, hooks, and complex UI logic.
- **Benefits:** This separation ensures that logic-heavy client components don't block the export of static metadata and makes it easier to stay within the 100-line modularity limit.

## 9. Theme Management System

The application uses a unified 3-way toggle (Light, Dark, System) for theme management.

- **State Management:** The `ThemeContextProvider` manages the active theme, applying `dark` or `light` classes to the `html` element based on user preference or OS-level `prefers-color-scheme`.
- **CSS Variables:** All components must use theme-aware CSS variables (e.g., `var(--background)`, `var(--card)`, `var(--text-primary)`) rather than hardcoded hex values to ensure visual consistency across both modes.
- **Persistence:** Theme preferences are persisted locally via `localStorage` and synchronized with the database using Server Actions for cross-device consistency.
- **Auth Boundary Policy:** To maintain a clean, high-conversion entry point, a manual theme toggle is intentionally omitted from the initial landing/login view.

## 10. Architectural Routing & Authentication Boundary

The application uses an architectural separation between marketing surfaces and authentication logic, leveraging session-aware routing at the root level.

- **Root Routing (`/`):** The root route is dynamic. Unauthenticated guests are served the high-conversion **Landing Page** (marketing content, tech stack, philosophy), while authenticated users are automatically served the primary **Dashboard**.
- **Dedicated Login (`/login`):** A dedicated, minimal authentication screen exists at `/login` for users who need to sign in without being exposed to full marketing content.
- **Theme Awareness:** Both the landing page and login screen are fully theme-aware, aligning with system preferences or saved local state.
- **Smart CTAs:** The landing page features dynamic call-to-action buttons that transform into "Go to Dashboard" links if a session is detected.

## 11. Global Footer Architecture

A premium, multi-column global footer is implemented to provide platform-wide navigation, social links, and legal information.

- **Structure:** Follows a 4-column layout (Brand, Navigation, Resources, Legal) on desktop, collapsing to a stacked layout on mobile.
- **Theme Integration:** Uses semantic colors (`var(--text-secondary)`, `var(--background-alt)`) to ensure readability and visual integration across light and dark modes.
- **Consistency:** The footer is shared across the landing page and public-facing routes, maintaining a consistent brand identity.

## 12. Zen Layout Architecture

To maximize user focus and minimize interface clutter, the application implements a "Zen Layout" pattern that distinguishes between public marketing surfaces and the authenticated workspace.

- **Workspace Focus:** Once logged in, the user is presented with a streamlined dashboard environment that prioritizes content creation and management tools. Marketing components like the multi-column footer are programmatically hidden.
- **Architectural Isolation:** Authenticated routing is handled by the root `page.tsx`, ensuring that the workspace and the landing page never overlap or cause layout shifts.
- **Loading Optimization:** Server-side session propagation (`auth()`) ensures that the correct layout is rendered immediately on the first byte, preventing "empty screen blinks" or layout shifts during the authentication handshake.

## 13. Nested Help & Navigation

Navigation complexity is managed by delegating auxiliary and legal links to a secondary "Help" sub-menu.

- **Location:** Integrated into the User Profile popover (`UserActions.tsx`) to keep the primary sidebar focused on core workflow tasks.
- **Sub-Menu Pattern:** Utilizes a nested MUI `Menu` structure, providing a hierarchical browsing experience for Documentation, Privacy Policy, and Terms of Service.
- **Aesthetic Consistency:** Uses the standard `HelpOutlinedIcon` and chevron indicators to provide clear visual cues for further interaction.

