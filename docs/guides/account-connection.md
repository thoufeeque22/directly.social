# Support & Help Hub

## Overview
The Support Hub provides users with immediate access to assistance, documentation, and troubleshooting resources directly within the application. It acts as a centralized location for addressing user inquiries and resolving common issues.

## Location & Access
- **Sidebar Navigation:** A dedicated "Support" link is available in the main application sidebar, easily recognizable by the `HelpOutlinedIcon`.
- **Settings Tab:** The Support link deep-links the user to the Settings page with the Support tab active (`/settings?tab=support`), ensuring a seamless transition into the administrative context.

## Core Capabilities
- **Quick Links:** Immediate access to common documentation, including user guides, FAQ, and API docs.
- **Contact Channels:** Direct channels for users to reach out to the support team or community forums.
- **Centralized Administration:** Integrated into the Settings tab architecture for a unified user experience.

## Technical Implementation
- **Routing:** Built using Next.js 15 query parameters. The Sidebar passes `?tab=support`, which the Settings page parses to render the `SupportTab` component.
- **UI Component:** The `SupportTab` component is located in the Settings module, following the application's Modular Engine architecture for form and tab management.
- **Iconography:** Utilizes Material UI's `HelpOutlinedIcon` for visual consistency.
