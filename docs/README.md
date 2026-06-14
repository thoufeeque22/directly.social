# Directly Social Documentation

Welcome to the Directly project documentation. This folder contains architectural blueprints, setup guides, and feature specifications.

## 🚀 User Guides

Learn how to use Directly Social to manage your content and grow your reach.
- [Account Connection](user/account-connection.md) - Linking your TikTok, YouTube, and Meta accounts.
- [Video Storage Setup](user/storage-setup.md) - Connecting private cloud storage for your media.
- [Publishing Your First Video](user/publishing-first-video.md) - Step-by-step guide to your first post.

## 🛠️ Power Users Setup

Technical guides for advanced users and power users configuring their own infrastructure.
- [Technical Vault Setup (BYOS)](dev/vault-setup.md) - Detailed S3 and CORS configuration.
- [Bring Your Own Key (BYOK)](dev/byok-guide.md) - Configuring your own platform API keys.
- [Meta API Configuration](dev/meta-guide.md) - Specific steps for Instagram and Facebook integration.

## 🏗️ Core Documentation

- [Architecture Overview](ARCHITECTURE.md) - Deep dive into system design, data models, and workflows.
- [AI Agent Orchestration](ORCHESTRATION.md) - Points to the AI agent workflows and instructions.

## Features

- [Metadata Templates](features/METADATA_TEMPLATES.md) - Reusable description snippets and bio links.
- [Global Search](features/GLOBAL_SEARCH.md) - Unified filtering for activity and media.
- [Notification Utility](features/NOTIFICATIONS.md) - Transactional alerts and bell icon system.
- [Global Refresh](features/GLOBAL_REFRESH.md) - Unified sync mechanism and Pull-to-Refresh gesture.
- [Manual Mode AI Polish](features/MANUAL_MODE_AI_ENHANCEMENT.md) - Seamless transition from Manual drafting to AI Enrich.
- [Support Hub](features/SUPPORT_HELP.md) - Documentation and help links relocated to the User Profile popover and Settings tab.
- [Sign-out Redirect](features/SIGN_OUT_REDIRECT.md) - UX improvement redirecting to landing page with success notification.

## ⚙️ Advanced & System Documentation

- [Platform Integrations](PLATFORM_INTEGRATIONS.md) - Details on external API integrations.
- [Adding a New Platform](DEVELOPER_GUIDE_PLATFORMS.md) - Guide for developers to integrate new social platforms.
- [Mobile Wrapper](MOBILE_WRAPPER.md) - Capacitor setup and native bridging.
- [Cloudflare Tunnel](CLOUDFLARE_TUNNEL_SETUP.md) - Local development and webhooks.

## Quality Assurance & Testing
- [UAT: Video Lifecycle](manual_tests/verify-video-lifecycle.md) - End-to-end publishing flow.
- [UAT: Notification Utility](manual_tests/ticket-400.md) - Functional verification of the bell icon and state sync.
- [UAT: Support Hub](manual_tests/ticket-399.md) - Support link and tab functionality.
- [UAT: Manual Mode AI Polish](manual_tests/514-enrich-title-description-button.md) - Action button UAT under issue #514.
- [UAT: Sign-out Redirect](manual_tests/ticket-661.md) - Verification of landing page redirect and notification.
