# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- **Stripe Customer Portal**: Pro and paid tier users can now manage their subscriptions directly from the settings page.
- **Freemium Guard**: Free tier users are now restricted to 10 video uploads per month.

### Changed
- **Billing UI**: Refactored the `AccountTab` settings page to extract billing logic into a modular `BillingSection` component.
- **Webhooks**: Extracted Stripe webhook routing logic into a standalone `webhook-registry.ts` to strictly maintain 100-line modularity rules.
