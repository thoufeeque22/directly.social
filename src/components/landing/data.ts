import React from 'react';
import SecurityIcon from '@mui/icons-material/Security';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

export const features = [
  {
    title: 'Native & Privacy-First',
    description: 'Native platform publishing with no middleware. Your data stays in your local vault, giving you absolute control.',
    icon: React.createElement(SecurityIcon, { fontSize: "large", color: "primary" }),
  },
  {
    title: 'Global Vibe Sync',
    description: 'AI-powered tone shifting that adapts your Shorts, Reels, and TikToks to the specific vibe of each platform.',
    icon: React.createElement(PsychologyIcon, { fontSize: "large", color: "primary" }),
  },
  {
    title: 'Sound-Check',
    description: 'Algorithmic boost via native trend scanning. Find and sync the trending music that drives reach.',
    icon: React.createElement(LibraryMusicIcon, { fontSize: "large", color: "primary" }),
  },
  {
    title: 'Unified Local Inbox',
    description: 'Cross-platform engagement managed entirely on your machine. No shared servers, no data leaks.',
    icon: React.createElement(AllInclusiveIcon, { fontSize: "large", color: "primary" }),
  },
];

export const comparisonBad = {
  title: "Legacy Middlemen",
  items: [
    "Monthly subscription fees ($50+/mo)",
    "They own your distribution keys",
    "Your content is stored on their servers",
    "Limited to their 'approved' platforms",
    "Slow API proxies and delays"
  ]
};

export const comparisonGood = {
  title: "Native Freedom",
  items: [
    "Zero platform fees (Free Core)",
    "You own your distribution keys",
    "Content stays in your local vault",
    "Native Publishing for peak speed",
    "Connect all accounts natively"
  ]
};

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
    title: 'Secure Local Vault',
    description: 'Connect your local drive. Your videos and metadata never leave your machine unless you say so.'
  },
  {
    step: 2,
    title: 'Bring Your Own Key',
    description: 'Plug in your official platform API keys using our simple setup wizards. No coding required.'
  },
  {
    step: 3,
    title: 'Native Publishing',
    description: 'Push directly from your device to TikTok, Instagram, and YouTube. Maximum reach, zero SaaS tax with Directly Social. [Learn why this matters](/philosophy)'
  }
];

export const activePlatforms = ['tiktok', 'instagram', 'youtube', 'facebook'];
export const upcomingPlatforms = ['linkedin', 'threads', 'x', 'reddit'];
