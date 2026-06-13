
## [2026-06-13 15:52:19] Verdict: APPROVED
# Product Spec: GDPR-Compliant Data Management

**Tickets:** 494-503
**Status:** Discovery Complete / APPROVED
**Verdict:** APPROVED

## 1. UX Strategy & Flow

### 1.1 Data Portability (Export)
Modern SaaS standards (Google Takeout, Meta) dictate an asynchronous flow for large datasets, but for our current scale, a mixed approach is best.

**User Journey:**
1. User navigates to `Settings > Privacy & Data`.
2. User clicks **"Request Data Export"**.
3. **Security Check:** System prompts for password re-authentication.
4. **Processing:** System generates a JSON file containing all user-related data (Profile, Destinations, Snippets, AI Configs).
5. **Delivery:** 
   - If small (< 5MB): Immediate download via browser.
   - If large: Email sent to the user's registered address with a time-limited (48h) signed download link.

### 1.2 Right to be Forgotten (Deletion)
Deletion must be definitive yet guarded against accidental activation.

**User Journey:**
1. User clicks **"Delete Account"** (styled as a destructive action).
2. **Double-Confirmation Modal:**
   - **Step 1:** Explains exactly what will be lost (Social connections, snippets, video metadata).
   - **Step 2:** User must re-authenticate (Password).
   - **Step 3:** User must type a confirmation string (e.g., "DELETE-MY-ACCOUNT") to enable the final button.
3. **Execution:**
   - Revoke all OAuth sessions via platform APIs.
   - Purge database records.
   - Sign out and redirect to home with a success toast.

---

## 2. UI Layout & Placement

### 2.1 Settings Tab Integration
Add a new tab to `SettingsTabs.tsx`:
- **ID:** `privacy`
- **Label:** `Privacy & Data`
- **Icon:** `ShieldIcon` or `SecurityIcon` from MUI.

### 2.2 Privacy & Data Content
Located in a new component `src/components/settings/PrivacyTab.tsx`:

- **Section: Personal Data Export**
  - Description: "Download a machine-readable copy (JSON) of your account data, including your profile, connected platforms, and saved snippets."
  - Button: `[Request Export]` (Primary Outlined)
- **Section: Account Deletion**
  - Description: "Permanently remove your account and all associated data from Social Studio. This action is irreversible."
  - Button: `[Delete Account]` (Error/Destructive Outlined)

---

## 3. Data Schema (Export)
The exported JSON file (`social-studio-data.json`) should follow this structure:
```json
{
  "user": { "id", "email", "name" },
  "destinations": [ { "platform", "platformId", "displayName" } ],
  "snippets": [ { "content", "tags", "platforms" } ],
  "settings": { "ai_config", "storage_config" },
  "audit_log": [ ... ]
}
```

---

## 4. Socratic Inquiry & Assumptions
1. **Background Jobs:** Assumed usage of Next.js API routes with a potential hand-off to a background worker (e.g., Inngest) if file sizes grow.
2. **Email Service:** Assumed availability of `src/lib/email` or similar for sending download links.
3. **Grace Period:** For MVP, deletion is immediate. Future versions may implement a 14-day recovery window.

---

## 5. Benchmarking
- **Google Takeout:** Best-in-class for granularity.
- **Twitter/X:** Good example of 'Request' -> 'Wait' -> 'Download' flow.
- **Intercom:** Clean single-page privacy settings.

