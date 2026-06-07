import React from 'react';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StorageIcon from '@mui/icons-material/Storage';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

export const features = [
  {
    title: 'Direct Connections (BYOK)',
    description: 'Connect directly to TikTok, YouTube, and Meta using your own keys. No middleware, no rate limit throttling, and you own the relationship.',
    icon: React.createElement(VpnKeyIcon, { fontSize: "large" }),
  },
  {
    title: 'Zero-Markup AI (BYOK)',
    description: 'Connect your own ChatGPT or Gemini account. Polish your content and generate viral hashtags without paying expensive monthly AI subscription fees.',
    icon: React.createElement(AutoAwesomeIcon, { fontSize: "large" }),
  },
  {
    title: 'Your Own Storage (BYOS)',
    description: "We don't store your videos. Keep them securely on your device or connect a private cloud bucket to manage your media.",
    icon: React.createElement(StorageIcon, { fontSize: "large" }),
  },
  {
    title: 'Metadata Snippets',
    description: 'Save and inject your most used hashtags, disclaimers, and calls-to-action with a single click. Stop retyping the same descriptions.',
    icon: React.createElement(ContentPasteIcon, { fontSize: "large" }),
  },
];

export const pricingTiers = [
  {
    name: 'Local Core',
    price: '$0',
    description: 'Free Forever. Perfect for solo creators who value privacy and control.',
    features: [
      'Unlimited Local Projects',
      'Bring Your Own Key (BYOK)',
      'Native Platform Publishing',
      'AI Vibe Sync (Local)',
      'Community Support'
    ],
    cta: 'Get Started',
    highlighted: true
  },
  {
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
];

export const howItWorksSteps = [
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
    description: 'Push directly from your device to the platforms. Enjoy maximum algorithmic reach with zero SaaS tax. [Learn why this matters](/philosophy)'
  }
];
