# Technical Specification: Migration to pnpm and Build Optimization (Ticket #621)

## Overview
This specification details the migration of the `social-studio-app` from `npm` to `pnpm` to improve dependency resolution speed and disk space efficiency. Additionally, it outlines optimizations for Sentry builds on Vercel to reduce deployment times.

## 1. Dependency Migration (pnpm)

### 1.1 Configuration (`.npmrc`)
To replicate the behavior of `legacy-peer-deps=true` in `npm`, we will configure `pnpm` to automatically install peer dependencies and be less strict about version mismatches.

**File:** `.npmrc`
```ini
auto-install-peers=true
strict-peer-dependencies=false
```

### 1.2 Migration Steps
1.  **Clean up:** Remove `node_modules` and `package-lock.json`.
2.  **Generate Lockfile:** Run `pnpm install` to generate `pnpm-lock.yaml`.
3.  **Validate Scripts:** Ensure `pnpm dev`, `pnpm build`, and `pnpm lint` work as expected.
4.  **Prisma Integration:** Confirm `prisma generate` runs correctly via the `postinstall` hook.

## 2. CI/CD Updates

### 2.1 GitHub Actions (`.github/workflows/deploy.yml`)
The deployment workflow needs to be updated to use `pnpm`.

**Changes:**
- Add `pnpm/action-setup` step.
- Replace `npm ci` with `pnpm install --frozen-lockfile`.
- Replace `npm run build` with `pnpm build`.

### 2.2 Oracle VPS Deployment
The VPS deployment currently runs `npm install` on the server.
**Options:**
1.  Install `pnpm` on the VPS (Recommended for consistency).
2.  Continue using `npm` on the VPS (Risk of lockfile drift).

**Proposed Action:** I will update the script to use `pnpm` on the VPS. If `pnpm` is not found, I will add a step to install it or provide instructions.

## 3. Vercel Build Optimization

### 3.1 Sentry Skipping
Vercel's build performance is impacted by Sentry source map uploads.
- **Action:** Set `SKIP_SENTRY_BUILD=true` for **Preview** deployments in Vercel project settings.
- **Code:** `next.config.ts` already implements this check.

### 3.2 Vercel Environment Detection
Vercel automatically detects `pnpm-lock.yaml` and will use `pnpm` for builds.

## 4. Implementation Plan

### Phase 1: Local Migration
- [ ] Create/Update `.npmrc`.
- [ ] Delete `package-lock.json`.
- [ ] Run `pnpm install`.
- [ ] Verify local build and prisma client generation.

### Phase 2: CI/CD Refactoring
- [ ] Modify `.github/workflows/deploy.yml`.
- [ ] Update VPS deployment commands in the workflow.

### Phase 3: Vercel Configuration
- [ ] (Manual/Instructional) Set `SKIP_SENTRY_BUILD=true` in Vercel UI.
- [ ] Trigger a preview deployment to verify speed improvement.

## 5. Risks & Mitigations
- **Peer Dependency Conflicts:** `pnpm` is stricter than `npm`. **Mitigation:** Use `auto-install-peers=true` and `strict-peer-dependencies=false`.
- **VPS Environment:** The VPS might not have `pnpm`. **Mitigation:** Use `curl -fsSL https://get.pnpm.io/install.sh | sh -` in the deployment script if `pnpm` is missing.

## 6. Verification Strategy
- **Success Criteria:**
    - `pnpm-lock.yaml` exists and `package-lock.json` is gone.
    - `pnpm install` completes without fatal peer dependency errors.
    - GitHub Actions passes.
    - Vercel build succeeds and is faster for previews.
