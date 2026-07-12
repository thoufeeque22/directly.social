# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- **Referral Redemption Flow**: Replaced automatic lifetime unlocking with an explicit redemption UI and `/api/referral/redeem` API, allowing users to actively claim their Grand Prize and choose between Free Cloud Pro or Lifetime BYOK when they hit 5 active paid referrals.
- **Stripe Customer Portal**: Pro and paid tier users can now manage their subscriptions directly from the settings page.
- **Freemium Guard**: Free tier users are now restricted to 10 video uploads per month.
- **App Store Metadata** (#500): Added Apple App Store subtitle ("Schedule & Post Natively") and Google Play short description to `brand.ts`. Created `docs/app-store/metadata.md` ASO reference.

### Changed
- **Billing UI**: Refactored the `AccountTab` settings page to extract billing logic into a modular `BillingSection` component.
- **Webhooks**: Extracted Stripe webhook routing logic into a standalone `webhook-registry.ts` to strictly maintain 100-line modularity rules.
