# directly.social Documentation

Welcome to the Directly project documentation. This folder contains architectural blueprints, setup guides, and feature specifications.

## 🚀 Getting Started

The quickest path to your first native post.
- [How to Login](user/login-guide.md) - Securely accessing your dashboard.
- [Account Connection](user/account-connection.md) - Linking your TikTok, YouTube, and Meta accounts.
- [Publishing Your First Video](user/publishing-first-video.md) - Step-by-step guide to your first post.

## 🎨 Core Features

Master the tools that make directly.social powerful and efficient.
- [Metadata Snippets](user/metadata-snippets.md) - Saving and injecting reusable hashtags and bio links.
- [AI Content Polish](user/ai-content-polish.md) - Using Vibe Sync and AI tools to enhance your captions.
- [Media Management & Cloud Sync](user/storage-setup.md) - Connecting private cloud storage (BYOS).

## 🛠️ Power Users Setup

Technical guides for advanced users and power users configuring their own infrastructure.
- [AI Provider Keys (BYOK)](dev/ai-byok-guide.md) - Configuring your own AI API keys (OpenAI, Gemini, Anthropic, Groq).
- [Social Platform Keys (BYOK)](dev/byok-guide.md) - Configuring your own platform API keys (TikTok, YouTube, Meta).
- [Cloud Storage Guide (BYOS)](dev/vault-setup.md) - Detailed S3 and CORS configuration.

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
