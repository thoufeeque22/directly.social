# Directly Social: User Personas & Modular Pricing Strategy

This document maps the various combinations of user behaviors, technical setups, and collaboration needs into distinct personas, and outlines a pricing model designed to capture each segment effectively.

---

## 🎭 The Persona Matrix

**Directly Social** users are defined by combinations across four main axes:
1.  **Scale:** Solo vs. Team vs. Agency
2.  **Infrastructure:** Managed SaaS vs. BYOS (Bring Your Own Storage) vs. Self-Hosted
3.  **Intelligence:** Managed AI vs. BYOK (Bring Your Own Key)
4.  **Workflow:** Spontaneous (Mobile) vs. Batcher (Desktop) vs. Recycler (Vault)

### 1. The "Tech-Savvy Creator" (The Open-Source Evangelist)
*   **Combination:** Solo + BYOK + BYOS + Self-Hosted.
*   **Profile:** A YouTuber or developer who values privacy and control. They have their own NAS or local server.
*   **Value Prop:** 100% data ownership. Their 4K raw files never touch a third-party server.
*   **Monetization:** **$0 (Free)**. They are the community builders, bug reporters, and word-of-mouth marketers.

### 2. The "Hustling Freelancer" (The High-Margin SaaS User)
*   **Combination:** Solo/Small Team + Managed Storage + Managed AI + Batcher.
*   **Profile:** Manages social media for 3-5 local businesses. Doesn't have the time or technical skill to configure AWS S3 or OpenAI API keys.
*   **Value Prop:** "It just works." Cheaper and cleaner than VistaSocial or Sprout Social.
*   **Monetization:** **Monthly Subscription ($29/mo)**. High margin because they pay for the convenience of managed infrastructure.

### 3. The "Cost-Conscious Power User" (The BYO-Hybrid)
*   **Combination:** Solo + Managed SaaS (UI) + **BYOK & BYOS**.
*   **Profile:** A high-volume creator who posts 5x a day across 4 platforms. They love the **Directly Social** cloud dashboard but don't want to pay high monthly SaaS fees for storage and AI markups.
*   **Value Prop:** "Enterprise power for the cost of a coffee." They use the hosted app but plug in their own S3 bucket and Gemini key.
*   **Monetization:** **Low Monthly ($7/mo) OR Lifetime Deal ($89)**. They pay for the software access, but cost you $0 in infrastructure.

### 4. The "Creator + Editor Duo" (The Collaborative Workflow)
*   **Combination:** Team (2-3) + Managed Storage + BYOK.
*   **Profile:** A creator who just hired an editor. The editor uploads to the vault; the creator approves and schedules.
*   **Value Prop:** Seamless handoff without sharing social media passwords.
*   **Monetization:** **Per-Seat Add-on ($12/mo)**. 

### 5. The "Event-Based Creator" (The Pay-As-You-Go User)
*   **Combination:** Solo + Managed Storage + Managed AI + Spontaneous.
*   **Profile:** An artist, musician, or conference organizer who only posts heavily during specific times of the year (e.g., during a tour or event week).
*   **Value Prop:** Zero monthly commitment. They only pay when they actually distribute content.
*   **Monetization:** **Pay-Per-Post Micro-transactions (e.g., $0.50 per post)**. High margin per transaction, eliminates churn because there is no subscription to cancel.

---

## 💰 Modular Pricing Strategy: "Build Your Own Plan"

Instead of forcing users into rigid "Bronze/Silver/Gold" tiers like legacy competitors (which often include things users don't need), **Directly Social** should use a **Base + Add-on (Modular)** pricing model, supplemented by a Pay-As-You-Go option. This directly monetizes the combinations above.

### Tier 1: The Core Application (Software License)
How does the user access the software?

*   **Self-Hosted (Local/Docker):** $0 Free Forever.
*   **Managed Cloud (The Dashboard):** $7/month (or $89 Lifetime). Includes access to the hosted UI, 5 social connections, and manual posting.
*   **Pay-As-You-Go (No Subscription):** $0/month. The user accesses the Cloud Dashboard for free, but pays a micro-transaction fee (e.g., **$0.50**) for every successful cross-platform distribution.

### Tier 2: The Infrastructure Toggles (The "BYO" Advantage)
How is the heavy lifting handled? Users must choose one path for AI and Storage.

**A. Storage (The Media Vault)**
*   **Toggle 1: BYOS (Bring Your Own Storage):** +$0/mo. (User connects Google Drive, S3, or Local Disk).
*   **Toggle 2: Directly Social Cloud Storage:** +$5/mo per 50GB. (High convenience, high margin for you).

**B. Intelligence (AI Vibe-Writer & Scans)**
*   **Toggle 1: BYOK (Bring Your Own Key):** +$0/mo. (User connects Gemini/OpenAI key).
*   **Toggle 2: Directly Social Managed AI:** +$10/mo. (Includes 500 AI operations. You buy wholesale API credits and sell retail).

### Tier 3: Collaboration Add-ons
*   **Solo:** Included in Base.
*   **Team Seat:** +$10/mo per extra user. Includes approval workflows.
*   **Agency Workspaces:** +$25/mo. Unlocks unlimited client sub-accounts and white-label reporting.

---

### Example Pricing Scenarios in Action:

**Scenario A (The Tech-Savvy Creator):**
*   Self-Hosted ($0) + BYOS ($0) + BYOK ($0) = **$0/month.**

**Scenario B (The Cost-Conscious Power User):**
*   Managed Cloud ($7) + BYOS ($0) + BYOK ($0) = **$7/month.** (They get a world-class UI, you get $7 of pure profit with zero server load).

**Scenario C (The Hustling Freelancer):**
*   Managed Cloud ($7) + Managed Storage ($5) + Managed AI ($10) + 1 Extra Seat ($10) = **$32/month.** (Highly competitive against Buffer/Publer, excellent MRR).

### Strategic Benefits
1.  **Defeats "Subscription Fatigue":** Users only pay for exactly what they use. If they have an API key, they don't feel "robbed" by an AI markup.
2.  **Protects Your Margins:** Heavy users who upload 100GB of video per month are forced into BYOS or paying for storage add-ons, preventing them from bankrupting your cloud infrastructure.
3.  **Maximum Acquisition:** The $7/mo "BYO" combination is aggressively cheap, acting as a massive funnel for early adoption.