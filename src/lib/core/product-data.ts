/**
 * Centralized Product & Business Data
 * 
 * Includes pricing tiers, feature lists, and marketing steps.
 * Centralizing this makes it easier to update the product offering,
 * change pricing, or toggle "Coming Soon" statuses globally.
 */

export const PRICING_TIERS = [
  {
    id: 'local-core',
    name: 'Local Core',
    price: '$0',
    description: 'Free Forever. Perfect for solo creators who value privacy and control.',
    features: [
      'Unlimited Local Projects',
      'Bring Your Own Key (BYOK - Use your own API accounts)',
      'Native Platform Publishing',
      'AI Vibe Sync (Local)',
      'Community Support'
    ],
    cta: 'Get Started',
    highlighted: true
  },
  {
    id: 'cloud-pro',
    name: 'Cloud Pro',
    price: '$15',
    period: '/mo',
    description: 'For power users who need sync and advanced AI.',
    features: [
      'Everything in Local Core',
      'Cloud Backup & Sync',
      'Encrypted Remote Vaults',
      'Priority Support',
      'Managed AI Endpoints'
    ],
    cta: 'Coming Soon',
    disabled: true
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
