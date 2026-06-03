## [2026-06-03 17:15:00] Verdict: APPROVED

### **UX STRATEGY & DISCOVERY REPORT**

#### **1. Competitive Research & Benchmarking**
*   **Google AI Studio (Gemini):**
    *   **Tiers:** Recommended transition to **Pay-as-you-go (Tier 1)**. The Free tier has extreme rate limits (15 RPM) that will fail in a production multi-user environment.
    *   **API Capabilities:** There is no direct "GetBalance" endpoint in the `GenerativeLanguage` API. Programmatic monitoring requires the **Google Cloud Billing API**.
*   **OpenAI:**
    *   **Tiers:** Recommended **Prepaid Credits** with auto-top-up enabled.
    *   **API Capabilities:** Uses the **Usage and Costs API** (`/v1/organization/costs`). Note that it tracks *spend* rather than *remaining balance* directly, requiring the app to calculate remaining credits relative to a set limit.

#### **2. UX Flow & Alerting**
*   **Monitoring Flow:** A background cron job (integrated into the existing standalone worker) will fetch billing data every 4 hours and update a global system status cache in the database.
*   **Alerting System:** If balance falls below a threshold ($10), a two-pronged alert triggers:
    1.  **Email Notification:** Sent to the system administrator via **Resend**.
    2.  **Admin UI Banner:** A non-intrusive warning displayed on the Admin Analytics dashboard.
*   **Safety Valve:** If the balance reaches $0, the app should gracefully degrade by disabling non-essential AI features and informing the Admin, rather than showing generic 500 errors to users.

#### **3. UI Layout & Placement**
*   **Primary Location:** **Admin Analytics Dashboard (`/admin/analytics`)**.
*   **UI Elements:**
    *   **Billing Summary Card:** A new metric card in the top row showing "Current Gemini Balance" and "Monthly OpenAI Spend".
    *   **Provider Health Section:** A dedicated section listing all AI providers, their current status (Healthy/Low/Critical), and the "Last Synced" timestamp.
    *   **Visual Standards:** Follows MUI standards with theme-aware colors (Success Green, Warning Amber, Error Red).

#### **4. Interrogation Log (Resolved)**
1.  **Threshold:** Fixed dollar amount ($10).
2.  **Notifications:** Resend.
3.  **Scope:** Platform's master keys only.
