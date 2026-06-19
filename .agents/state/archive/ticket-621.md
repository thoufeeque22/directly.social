# Ticket #621: [Optimization] Migrate to pnpm and tune Vercel Build Performance

## Status
- [x] Initialization
- [x] Discovery
- [x] Development
- [x] Review
- [x] QA
- [x] Documentation
- [x] Closure

## Context
Vercel deployments are currently slow (3+ minutes) due to:
1. `npm` dependency resolution (specifically large packages like `@mui` and `@capacitor`).
2. Sentry source map uploads during the `next build` phase.

## Goals
1. Migrate from `npm` to `pnpm`.
2. Optimize Sentry build times on Vercel.

## Technical Specification
The detailed plan is available in [.agents/state/ticket-621-spec.md](.agents/state/ticket-621-spec.md).
## Tasks
- [x] Run Discovery to analyze dependencies and Vercel configuration.
- [x] Delete `package-lock.json` and generate `pnpm-lock.yaml`.
- [x] Update GitHub Actions `deploy.yml`.
- [x] Configure `.npmrc` for peer dependency management and allowed build scripts.
- [x] Implement `SKIP_SENTRY_BUILD` logic for Preview deployments. (Verified: already implemented in `next.config.ts`).


## 🛠️ Development
### Phase 1: Dependency Migration
- Updated `.npmrc` with `auto-install-peers=true`, `strict-peer-dependencies=false`, and `only-built-dependencies`.
- Deleted `package-lock.json`.
- Ran `pnpm install` and approved build scripts.
- Verified `pnpm run build` (Success).
- Verified `pnpm run lint` (Succeeded in running, found pre-existing React 19/ESLint 9 issues).

### Phase 2: CI/CD Updates
- Updated `.github/workflows/deploy.yml` to use `pnpm/action-setup@v4` and `cache: 'pnpm'`.
- Updated VPS deployment script to ensure `pnpm` is installed and used for production dependencies.

### ⚠️ Post-Migration Incident (Fixed)
- **Issue**: Vercel build failed due to missing `@ai-sdk/provider-utils` module (phantom dependency).
- **Fix**: Explicitly added `@ai-sdk/provider-utils` to `package.json` to satisfy `pnpm`'s strict dependency resolution.
- **Verification**: Local `pnpm run build` verified as passing.

## Verdict
SUCCESS

- Current Branch: `feature/621-migrate-to-pnpm`
- Repository: `thoufeeque22/social-studio-app`
