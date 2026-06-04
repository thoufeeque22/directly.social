# Directly: Scaling & Revenue Strategy

## Part 1: Technical Scaling (Handling Public Load)
When transitioning from local development to a public app, you must protect your infrastructure and your wallet from API abuse.

1. **Upgrade to a Paid API Tier:** Move from the Gemini Free Tier (15 requests/minute) to Pay-as-you-go. Paid tiers offer thousands of requests per minute, and since you use Flash models, the cost is fractions of a penny per generation.
2. **User-Level Rate Limiting:** Use Next.js Middleware with a service like Upstash Redis to cap how many AI generations a single user can perform per hour/day. This prevents malicious users from running up your API bill.
3. **Background Queuing:** Implement a job queue (like Inngest or BullMQ) for the AI generation. Instead of the frontend waiting synchronously and timing out, requests are queued and processed safely at your API's maximum comfortable throughput.
4. **Bring Your Own Key (BYOK):** Allow power users to plug in their own Gemini or OpenAI API keys in the settings. This shifts the API cost entirely to them.
5. **Internal User Credits:** Manage the consumption of platform-provided AI services via the `aiCredits` field. See the [Internal User Credits Feature](features/INTERNAL_USER_CREDITS.md) for details on the feature flag and BYOK bypass logic.

---

## Part 2: Revenue Plan & Go-To-Market Strategy
**Goal:** Acquire initial users rapidly through low friction, prove the value of the platform, and build a sustainable Monthly Recurring Revenue (MRR) machine.

### Phase 1: The "Taste-Test" Freemium Model (Acquiring Clients First)
To get users through the door, you must completely remove the friction of adoption.
* **The "Core" is Free:** Give users 2 free social accounts (e.g., YouTube + TikTok) and 5 manual cross-posts per month. 
* **The "AI Teaser":** Give every new user 3 free "AI Auto-Scans" when they sign up. 
* **The Psychology:** Once a creator experiences how much time the AI auto-scan saves them, they will not want to go back to typing descriptions manually. When they hit the paywall on their 4th try, the conversion rate will be massive.

### Phase 2: Finding Your Early Adopters
Don't run paid ads yet. Target people who are actively frustrated.
* **"Eat Your Own Dog Food":** Build a TikTok/Reels presence documenting the building of Directly, and use Directly to publish those videos! 
* **Product Hunt Launch:** Position the app as the "AI-Native, affordable alternative to Metricool & Buffer."
* **Direct Outreach:** Search Twitter/X and Reddit for creators complaining about how expensive or clunky existing social media schedulers are, and offer them lifetime free access in exchange for beta feedback.

### Phase 3: The Subscription Tiers (Disruptive Pricing)
With competitors like Buffer charging $30/mo for 5 channels, Directly wins by offering a flat-rate, high-volume model enabled by **BYOK** and **BYOS**.

**1. Creator Pro ($7 / month)**
*   **Target:** Solo YouTubers and TikTokers.
*   **Capacity:** Up to 10 social connections (2x Buffer for 25% of the price).
*   **The "Bring Your Own" Advantage:** Unlimited AI use via **BYOK** and unlimited media storage via **BYOS** (Google Drive/S3/Local).
*   **Message:** "All your channels for the price of ONE Buffer channel."

**2. Agency / Business ($24 - $29 / month)**
*   **Target:** Freelancers managing social media for multiple clients.
*   **Capacity:** Unlimited social connections.
*   **Managed Services:** Includes a base pool of platform-provided AI credits and managed cloud storage for those who don't want to set up their own.
*   **Team Access:** Up to 5 team members with role-based permissions.

### Phase 4: The "Subscription Killer" Lifetime Deal (LTD)
Many creators suffer from "subscription fatigue". You can offer a massive win-win:
*   **$89 One-Time Payment + BYOK/BYOS**
*   **The Offer:** Lifetime access to the Directly desktop/web portal.
*   **Zero Marginal Cost:** Users plug in their *own* Gemini API key and *own* storage (S3/GDrive).
*   **Why it works:** You get an instant injection of cash (LTDs are magnets for early adopters), and because the user handles their own API and storage costs, they cost you $0/mo to maintain. This is your primary weapon against legacy SaaS tools.
