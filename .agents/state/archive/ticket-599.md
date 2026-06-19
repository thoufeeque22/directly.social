# Ticket #599: DevOps: Implement Atomic Symlink Deploys for Instant Rollback

## 📋 Status
- **Phase**: Documentation (QA Strategy Defined)
- **Branch**: `devops/atomic-symlink-deploy-599`
- **Owner**: `qa-agent` -> `doc-agent`

## 🎯 Goals
Implement an **Atomic Symlink Deployment** strategy to achieve:
1. **Zero-Downtime**: The new version is prepared in a separate folder and swapped in instantly.
2. **Instant Rollback**: If a deployment fails, the `current` symlink can be pointed back to the previous release folder in seconds.
3. **Zero Financial Cost**: Leverages existing Oracle VPS infrastructure.

## 🛠️ Refined Implementation Plan
1. **GitHub Actions CI/CD (`.github/workflows/deploy.yml`)**:
   - Establish as the primary deployment method.
   - Sync artifacts to a SHA-based release folder (`~/social-studio-app/releases/<SHA>`) on the VPS.
   - Symlink the shared `.env` from the base directory.
   - Install production dependencies and generate Prisma client in the release folder.
   - Perform the atomic symlink swap of `current` to the new release folder.
   - Gracefully restart PM2 processes.
   - Cleanup: Keep only the last 5 releases to conserve disk space.
2. **Manual Update Script (`scripts/update.sh`)**:
   - Maintain parity with the CI/CD folder structure for on-server or fallback updates.
   - Clone repository, build locally on VPS, and perform the atomic symlink swap seamlessly.
3. **Instant Rollback Script (`scripts/rollback.sh`)**:
   - Create a dedicated script to list available releases and instantly swap the `current` symlink back to a previous working version, followed by a PM2 restart.
4. **Failure Resilience & Safety**:
   - Ensure the symlink is *only* swapped if all prior steps (install, build, Prisma generation) succeed. If any step fails, the deployment aborts, leaving the current version untouched.

## 🧪 QA Testing Strategy (To be performed on VPS)
### 1. CI/CD Deployment Verification
- **Test**: Trigger `git push` to `main`.
- **Expected**: Files synced to `~/social-studio-app/releases/<SHA>`, `current` symlink updated, PM2 restarted, `releases` folder contains ≤ 5 items.
### 2. Manual Update Verification
- **Test**: Execute `~/social-studio-app/current/scripts/update.sh`.
- **Expected**: Similar to CI/CD, creating a new timestamped release folder, successfully swapping `current`, and restarting PM2.
### 3. Rollback Verification
- **Test**: Execute `~/social-studio-app/current/scripts/rollback.sh`.
- **Expected**: `current` symlink points to the release folder that was active prior to the current one, PM2 restarted with the previous version.

## ✅ Definition of Ready (DoR)
- [x] `deploy.yml` implements the atomic deployment process without server downtime.
- [x] `scripts/update.sh` correctly executes an atomic deployment natively on the VPS.
- [x] `scripts/rollback.sh` is implemented, enabling robust, single-command rollback to previous releases.
- [x] Deployment logic guarantees that a failed deployment does not impact the active (`current`) release.
- [x] Shell scripts utilize strict bash error handling (`set -e`).
- [x] Implementation complies with project standards (e.g., zero-any, robust error handling).

## 🔄 Agent Chain Progress
- [x] **Discovery**: Researching implementation details and finalizing technical specification.
- [x] **Development**: Implementing CI/CD and script changes.
- [x] **Review**: Architectural and security audit.
- [x] **QA**: Verification of deployment logic defined.
- [x] **Documentation**: Updating guides.
- [x] **Project**: Finalizing issue state.

## 📝 Notes
- Documentation in `docs/LAUNCH_GUIDE.md` and `docs/ARCHITECTURE.md` has been updated to reflect the Atomic Symlink Deployment strategy.
- Task complete. Handoff to Project Agent for final closure of ticket #599.
- Final Completion verified by Project Agent. Ticket ready for closure.

