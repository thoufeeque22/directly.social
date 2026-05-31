---
ticket_id: 570
branch_name: feature/570-enforce-50-line-rule
goal: Automate 50-line modularity rule enforcement via ESLint
status: ready-for-merge
---

# Round 1

## 🔍 Discovery

### Strategic Importance
Automating the 50-line modularity rule shifts enforcement from manual architectural audits to the CI pipeline. This ensures that technical debt (monolithic files) is stopped at the source for all new modules, maintaining the "Antigravity" principle of small, composable units.

### Dual-Agent Protocol (Advocate vs Skeptic)
- **Advocate**: "We must enforce this strictly. By using `max-lines: 50` in ESLint, we prevent any new file from exceeding the limit. For legacy files, we use `eslint-disable` to create a 'grandfathered' baseline that we can chip away at during refactors."
- **Skeptic**: "Enforcing this on tests might be too much, as test suites naturally grow. Also, `eslint-disable` doesn't prevent adding *more* code to legacy files. We need to combine this with the existing Review-agent audit."
- **Resolution**: Enable `max-lines: 50` for all source files. Exclude `src/__tests__/**` to allow for comprehensive test suites. Use `/* eslint-disable max-lines */` in existing legacy files to maintain build stability while highlighting debt.

### Technical Blueprint
1.  **ESLint Configuration**:
    - Update `eslint.config.mjs` to include the `max-lines` rule.
    - Rule: `["error", { "max": 50, "skipBlankLines": true, "skipComments": true }]`.
    - Apply to `src/**/*.{ts,tsx,js,jsx}`.
    - Exclude `src/__tests__/**` from this specific rule to avoid breaking test suites.
2.  **Legacy Debt Baseline**:
    - Identified 101 non-test files in `src/` currently exceeding 50 lines.
    - Scripted addition of `/* eslint-disable max-lines */` at the top of these 101 files.
3.  **Mandate Update**:
    - Update `GEMINI.md` to reflect that the rule is now automated for new files.
    - Update `CORE.md` to clarify the role of ESLint in enforcement.

### Impact Radius
- **Developer Workflow**: Developers will receive immediate feedback if a new file exceeds 50 lines.
- **CI/CD**: `npm run lint` will fail on violations, preventing merge of oversized modules.
- **Legacy Files**: 101 files will be marked as debt. The `eslint-disable` serves as a "red flag" for future refactoring.

### Production Readiness
- No runtime impact.
- Standard ESLint rule used (low risk of parser issues).
- Skip comments/blanks ensures logic-focused enforcement.

### Test Specification
1.  **Positive Test**: Create `src/lib/small-module.ts` (40 lines) -> `npm run lint` passes.
2.  **Negative Test**: Create `src/lib/large-module.ts` (55 lines) -> `npm run lint` fails.
3.  **Legacy Test**: Verify an existing file with `eslint-disable` (e.g., `src/app/schedule/page.tsx`) passes linting despite being > 50 lines.
4.  **Test Exclusion**: Verify a test file in `src/__tests__/` > 50 lines passes without needing `eslint-disable`.

## 🛠️ Development
- **Actions**:
  - Configured ESLint to enforce `max-lines: 50` for `src/` files, excluding tests.
  - Identified 75 files in `src/` exceeding 50 lines using a custom script.
  - Grandfathered these 75 files by adding `/* eslint-disable max-lines */` to the top.
  - Updated `GEMINI.md` and `.gemini/base/CORE.md` to document the automated rule and legacy debt protocol.
  - Verified enforcement with temporary large files (compliant and non-compliant).
  - Verified test exemption.
- **Modified Files**:
  - `eslint.config.mjs`
  - `GEMINI.md`
  - `.gemini/base/CORE.md`
  - 75 files in `src/` (added `eslint-disable max-lines`)

## 🛡️ Review
- **Audit Findings**:
  - `eslint.config.mjs` correctly implements `max-lines: 50` with `skipBlankLines: true` and `skipComments: true`.
  - Path-based exclusion for `src/__tests__/**` is active and verified; test files > 50 lines do not trigger errors.
  - Sample of grandfathered files (e.g., `src/app/actions/ai.ts`, `src/auth.ts`) verified to have `/* eslint-disable max-lines */` at line 1.
  - Documentation in `GEMINI.md` and `.gemini/base/CORE.md` is updated, clear, and adheres to the "No Emojis" policy.
  - No `any` types were introduced in the configuration or documentation.
  - Security audit: No risks identified in the ESLint configuration or file comments.
- **Checklist**:
  - [x] Modularity (50-line rule)
  - [x] Zero-Any Policy
  - [x] No Emojis
  - [x] Security/Audit

## 🧪 QA
- **Scenarios**:
  1. **Positive Test**: Create `src/lib/small-module.ts` (40 lines) -> Verify `npx eslint` passes.
  2. **Negative Test**: Create `src/lib/large-module.ts` (55 lines) -> Verify `npx eslint` fails with `max-lines` error.
  3. **Legacy Test**: Verify `src/auth.ts` (> 50 lines with `eslint-disable`) passes.
  4. **Test Exclusion**: Create `src/__tests__/large-test.ts` (60 lines) -> Verify `npx eslint` passes without `eslint-disable`.
  5. **Regression Suite**: Run `npm run lint` and `npm run build` on the entire project.
- **Results**:
  - [x] **Positive Test**: Passed. `src/lib/small-module.ts` (40 lines) reported no errors.
  - [x] **Negative Test**: Passed. `src/lib/large-module.ts` (55 lines) failed with: `error File has too many lines (54). Maximum allowed is 50 max-lines`.
  - [x] **Legacy Test**: Passed. `src/auth.ts` (85 lines) passes linting due to `/* eslint-disable max-lines */`.
  - [x] **Test Exclusion**: Passed. `src/__tests__/large-test.ts` (60 lines) passes linting as `src/__tests__/**` is ignored in the rule config.
  - [x] **Regression Suite**: `npm run lint` and `npm run build` completed successfully. No new `max-lines` violations were found in `src/`. Existing files exceeding 50 lines are correctly grandfathered.

## 📝 Documentation
- **Updates**:
  - `GEMINI.md`: Updated Global Mandates to reflect automated 50-line rule enforcement via ESLint and the protocol for legacy files.
  - `.gemini/base/CORE.md`: Added technical details on ESLint modularity enforcement and test exemptions.
  - `docs/ARCHITECTURE.md`: Added a dedicated section on Modularity Enforcement (The 50-Line Rule) explaining automation, exceptions, and legacy support.
  - `eslint.config.mjs`: Added `max-lines` rule configuration with path-based exclusions.

## 📊 Project
- **Commit Message**: `refactor: automate 50-line modularity rule via ESLint #570`
- **GitHub Update**: Issue #570 updated with work summary.
- **Status**: Ready for merge.
