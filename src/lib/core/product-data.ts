/* eslint-disable max-lines */
/**
 * Centralized Product & Business Data
 * 
 * Includes pricing tiers, feature lists, and marketing steps.
 * Centralizing this makes it easier to update the product offering,
 * change pricing, or toggle "Coming Soon" statuses globally.
 */

export const PRICING_TIERS = [
  {
    id: 'free-starter',
    name: 'Free Starter',
    price: '$0',
    description: 'Easiest way to start. No technical setup required.',
    features: [
      'Up to 3 Social Connections',
      '10 Posts per Month',
      'Ephemeral Storage (Deletes after 24h)',
      'Watermarked Posts'
    ],
    cta: 'Start Free',
    highlighted: false
  },
  {
    id: 'free-hacker',
    name: 'Free Hacker',
    price: '$0',
    description: 'For technical creators who want unlimited capacity.',
    features: [
      'Unlimited Social Connections',
      'Unlimited Posts',
      'Requires BYOK & BYOS',
      'Watermarked Posts'
    ],
    cta: 'Build Your Own',
    highlighted: false
  },
  {
    id: 'power-pass',
    name: '24-Hour Pass',
    price: '$2.99',
    period: '/day',
    description: 'The Weekend Batcher. No monthly commitment.',
    features: [
      'Removes Watermark for 24h',
      'Unlimited High-Speed Scheduling',
      'Includes 50 Managed AI Credits',
      'Temporary Managed Storage'
    ],
    cta: 'Buy Pass',
    highlighted: true
  },
  {
    id: 'creator-pro',
    name: 'Creator Pro',
    price: '$5',
    period: '/mo',
    description: 'For technical creators who want clean branding and low costs.',
    features: [
      'Unlimited Connections & Posts',
      'Permanent Watermark Removal',
      'Visual Content Calendar',
      'Analytics (Free Future Update)',
      'Requires BYOK & BYOS'
    ],
    cta: 'Subscribe (BYO)',
    highlighted: false
  },
  {
    id: 'cloud-pro',
    name: 'Cloud Pro',
    price: '$20',
    period: '/mo',
    description: 'The "It Just Works" fully managed plan. Focus on your content, we handle the infrastructure.',
    features: [
      'Unlimited Connections & Posts',
      'Bulk Post Upload (CSV)',
      '50GB Managed Cloud Storage',
      '500 Managed AI Operations',
      'First-in-Line Priority Support'
    ],
    cta: 'Get Cloud Pro',
    highlighted: true
  },
  {
    id: 'agency-pro',
    name: 'Agency Scale',
    price: '$99',
    period: '/mo',
    description: 'For social media managers and creative agencies managing multiple clients.',
    features: [
      'Everything in Cloud Pro',
      'Includes 5 Team Seats',
      'Client Approval Workflows',
      'White-Label Client Dashboard'
    ],
    cta: 'Join Waitlist (Coming Soon)',
    disabled: true,
    highlighted: false
  },
  {
    id: 'lifetime-deal',
    name: 'Lifetime License',
    price: '$89',
    period: ' one-time',
    description: 'Anti-SaaS. Own the software forever.',
    features: [
      'Creator Pro Features Forever',
      'Requires BYOK & BYOS',
      'No Monthly Subscription',
      'Zero Marginal Cost'
    ],
    cta: 'Claim LTD',
    highlighted: false
  }
] as const;

export const INFRASTRUCTURE_ADDONS = [
  {
    id: 'managed-storage',
    name: 'Managed Storage',
    price: '$5',
    period: '/mo',
    description: '50GB of Cloud Storage (Replaces BYOS)'
  },
  {
    id: 'managed-ai',
    name: 'Managed Intelligence',
    price: '$10',
    period: '/mo',
    description: '500 AI Operations (Replaces BYOK)'
  },
  {
    id: 'team-seat',
    name: 'Team Workspace',
    price: '$15',
    period: '/mo',
    description: '1 Extra Seat + Approval Workflows'
  }
] as const;

export const PRODUCT_FEATURES = [
  {
    id: 'byos',
    title: 'Your Own Storage (BYOS)',
    description: "We don't store your videos. Connect a private cloud bucket (Bring Your Own Storage) to manage your media directly.",
    iconName: 'Storage'
  },
  {
    id: 'byok-platforms',
    title: 'Direct Connections (BYOK)',
    description: 'Connect directly to TikTok, YouTube, and Meta using your own keys (Bring Your Own Key). No middleware, no rate limits, you own the connection.',
    iconName: 'VpnKey'
  },
  {
    id: 'byok-ai',
    title: 'Zero-Markup AI (BYOK)',
    description: 'Connect your own ChatGPT or Gemini account (Bring Your Own Key). Polish content without paying expensive monthly subscription markups.',
    iconName: 'AutoAwesome'
  },
  {
    id: 'snippets',
    title: 'Metadata Snippets',
    description: 'Save and inject your most used hashtags, disclaimers, and calls-to-action with a single click. Stop retyping the same descriptions.',
    iconName: 'ContentPaste'
  }
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Your Media, Your Storage',
    description: 'Keep your videos securely on your device or connect your own private cloud storage. We never hold your files hostage.'
  },
  {
    step: 2,
    title: 'Direct Platform Sync',
    description: 'Link your TikTok, YouTube, and Meta accounts directly using our simple setup wizards. No coding required, and you own the connection.'
  },
  {
    step: 3,
    title: 'Native Publishing',
    description: 'Push directly from your device to the platforms. Enjoy maximum algorithmic reach with zero SaaS tax.'
  }
] as const;
