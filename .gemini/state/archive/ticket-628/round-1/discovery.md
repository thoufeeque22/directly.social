## [2026-06-03 17:40:37] Verdict: APPROVED

### **TECHNICAL BLUEPRINT**

#### **1. External API Integration**
- **Target:** Google Cloud Budgets API (part of `googleapis`).
- **Auth:** Requires a Service Account JSON with `Billing Account Viewer` permissions. This will be stored as an environment variable `GOOGLE_BILLING_SERVICE_ACCOUNT`.
- **Logic:** Fetch "Current Month Spend" for the linked Billing Account.
- **OpenAI (Future):** Ready for `/v1/organization/costs` integration.

#### **2. Data Model Changes**
- **New Table:** `SystemBilling`
  - `id`: String (UUID)
  - `provider`: String (e.g., "gemini", "openai")
  - `currentSpend`: Decimal
  - `threshold`: Decimal (default: 10.00)
  - `currency`: String (default: "USD")
  - `lastSynced`: DateTime
  - `status`: String ("HEALTHY", "WARNING", "CRITICAL")
  - `updatedAt`: DateTime

#### **3. Backend Services**
- **`src/lib/services/billing-service.ts`**:
  - `syncGeminiBilling()`: Fetches spend from GCP, calculates health, updates DB.
  - `checkThresholds()`: Logic to trigger alerts if spend approaches/exceeds budget limits (relative to prepaid amount or fixed threshold).
  - `sendAdminAlert()`: Integrates with `src/lib/services/email-service.ts` (using Resend).

#### **4. Worker Integration**
- **`src/lib/worker/worker.ts`**:
  - Add a 4-hour interval task: `setInterval(syncAllBilling, 4 * 60 * 60 * 1000)`.

#### **5. UI Layout**
- **Dashboard:** `/admin/analytics`
- **Components:**
  - `BillingCard`: Displays current spend and status.
  - `BillingAlertBanner`: Sticky warning at the top of the admin page if any provider is in "WARNING" or "CRITICAL" state.

### **TEST SPECIFICATION**

#### **1. Socratic Log**
- **Q:** How do we calculate "remaining balance" for Google Cloud?
- **A:** Google Cloud doesn't always provide a "remaining credits" API for Pay-as-you-go. We will track "Current Month Spend" and alert when it exceeds a safety threshold (e.g., notifying the user to check their budget). For prepaid, we calculate `Total Credits - Current Spend`.
- **Q:** What happens if the Service Account key is invalid?
- **A:** The `BillingService` will catch the error, log it to Sentry, and set the provider status to "UNKNOWN" in the UI.

#### **2. Automated Tests (Vitest)**
- **`billing-service.test.ts`**: Mock `googleapis` responses and verify `checkThresholds` logic triggers the correct status transitions and email calls.

#### **3. Manual Verification**
- Temporarily set the threshold to $0.01 in the DB and verify that a Resend email is triggered on the next sync.
- Verify the Admin Dashboard reflects the "CRITICAL" status with the red banner.
