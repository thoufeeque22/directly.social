# Directly: Scaling & Revenue Strategy

## Part 1: Technical Scaling (Handling Public Load)
When transitioning from local development to a public app, you must protect your infrastructure and your wallet from API abuse.

1. **Upgrade to a Paid API Tier:** Move from the Gemini Free Tier to Pay-as-you-go.
2. **User-Level Rate Limiting:** Use Next.js Middleware with Upstash Redis to cap AI generations per user.
3. **Background Queuing:** Implement a job queue (like Inngest) for safe asynchronous processing.
4. **The Infrastructure Rule (BYOK & BYOS):** To support radical pricing, we push infrastructure costs to the user. Free and Lifetime users MUST use their own API keys (BYOK) and their own storage (Local/BYOS) unless they explicitly purchase a "Managed Infrastructure" add-on.

---

## Part 2: The Non-Conflicting Pricing Matrix
To avoid cannibalization, the pricing model is strictly separated into **Software Access** and **Infrastructure Add-ons**.

### 1. Software Access (How you use the app)
*   **The Free Starter Tier (Managed):**
    *   *Features:* Up to 3 social connections, 10 posts per month.
    *   *The Catch:* Posts are watermarked. Storage is *ephemeral* (files are deleted 24h after posting to save us AWS costs).
    *   *The Value:* Zero technical setup required. Perfect for casual users.
*   **The Free Hacker Tier (BYO):**
    *   *Features:* Unlimited social connections, unlimited posts.
    *   *The Catch:* Posts are watermarked. You MUST use your own AWS S3 bucket (BYOS) and Gemini API key (BYOK).
    *   *The Value:* Rewards technical creators with enterprise-grade capacity for $0, costing us nothing to host.
*   **The 24-Hour Power Pass ($2.99):**
    *   Unlocks the watermark, grants 50 Managed AI credits, and allows unlimited high-speed scheduling for 24 hours. Perfect for the "Weekend Batcher".
*   **Creator Pro ($5 / month):**
    *   Removes the watermark permanently. Unlocks advanced analytics and evergreen recycling.
*   **The Lifetime License ($89 One-Time):**
    *   Unlocks the Creator Pro software features forever. (Does *not* include managed infrastructure).

### 2. Infrastructure Add-ons (Where we do the heavy lifting)
Users on *any* tier (even Free or Lifetime) can buy these if they don't want to configure BYOK/BYOS.
*   **Managed Cloud Storage:** $5 / month per 50GB. (High margin; replaces BYOS).
*   **Managed AI Intelligence:** $10 / month for 500 AI operations. (High margin; replaces BYOK).
*   **Team Workspaces:** $15 / month per extra seat (Includes approval workflows).

### Why this doesn't conflict:
- **Free vs. Pro:** Free is watermarked and completely self-funded (BYOS/BYOK). If they hate watermarks, they pay $5/mo.
- **Pass vs. Pro:** A $2.99 pass is for casual users. If they use it twice a month ($6), they will naturally upgrade to the $5/mo Pro tier.
- **Lifetime vs. MRR:** The $89 LTD only unlocks the *Software*. If a lifetime user gets tired of managing their own S3 bucket, they can still buy the $5/mo Managed Storage add-on, giving us recurring revenue on top of their LTD payment.

---

## Part 3: Go-To-Market Execution
1. **"Eat Your Own Dog Food":** Build a TikTok/Reels presence documenting the building of Directly, using Directly to publish.
2. **Product Hunt Launch:** Position as the "Anti-SaaS, Lifetime-Deal alternative to Buffer." 
3. **Direct Outreach:** Target creators on Twitter/Reddit complaining about SaaS subscription fatigue.
