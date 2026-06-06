# Directly Social Documentation

Welcome to the Directly project documentation. This folder contains architectural blueprints, setup guides, and feature specifications.

## Core Documentation

- [Architecture Overview](ARCHITECTURE.md) - Deep dive into system design, data models, and workflows.
- [AI Agent Orchestration](ORCHESTRATION.md) - Points to the AI agent workflows and instructions.

## Features

- [Metadata Templates](features/METADATA_TEMPLATES.md) - Reusable description snippets and bio links.
- [Global Search](features/GLOBAL_SEARCH.md) - Unified filtering for activity and media.
- [Notification Utility](features/NOTIFICATIONS.md) - Transactional alerts and bell icon system.
- [Global Refresh](features/GLOBAL_REFRESH.md) - Unified sync mechanism and Pull-to-Refresh gesture.
- [Manual Mode AI Polish](features/MANUAL_MODE_AI_ENHANCEMENT.md) - Seamless transition from Manual drafting to AI Enrich.
- [Support Hub](features/SUPPORT_HELP.md) - Centralized help and resources accessible from the sidebar.

## Guides & Troubleshooting

- [Platform Integrations](PLATFORM_INTEGRATIONS.md) - Details on external API integrations.
- [Adding a New Platform](DEVELOPER_GUIDE_PLATFORMS.md) - Guide for developers to integrate new social platforms.
- [Mobile Wrapper](MOBILE_WRAPPER.md) - Capacitor setup and native bridging.
- [Cloudflare Tunnel](CLOUDFLARE_TUNNEL_SETUP.md) - Local development and webhooks.

## Quality Assurance & Testing

- [E2E Testing Guide](E2E_TESTING.md) - Playwright workflow and infrastructure.
- [UAT: Metadata Templates](manual_tests/verify-metadata-templates.md) - Core snippet workflow.
- [UAT: Global Search](manual_tests/verify-global-search.md) - Unified search field verification.
- [UAT: Snippets UX Improvements](manual_tests/verify-snippets-ux-improvements.md) - UX closing logic.
- [UAT: Upcoming Posts Navigation](manual_tests/verify-upcoming-posts-navigation.md) - Dashboard-to-Schedule deep linking.
- [UAT: Video Lifecycle](manual_tests/verify-video-lifecycle.md) - End-to-end publishing flow.
- [UAT: Notification Utility](manual_tests/ticket-400.md) - Functional verification of the bell icon and state sync.
- [UAT: Support Hub](manual_tests/ticket-399.md) - Support link and tab functionality.
- [UAT: Manual Mode AI Polish](manual_tests/514-enrich-title-description-button.md) - Action button UAT under issue #514.
