import React from 'react';

export const faqs = [
  {
    question: "What does 'Native' actually mean?",
    answer: <>Most social media tools act as a middleman. They store your data and passwords on their servers and then send them to the platforms. <strong>Directly Social</strong> connects your computer directly to the platforms using their official APIs, meaning your data never leaves your control.</>
  },
  {
    question: <>Is <strong>Directly Social</strong> really free?</>,
    answer: "Yes, our Local Core tier is free forever. Since the app runs on your machine and uses your own API keys, our overhead is low, and we pass those savings directly to you."
  },
  {
    question: "How do I get my own API keys?",
    answer: "We provide step-by-step guides for creating developer accounts on TikTok, Instagram, and YouTube. It's a one-time setup that gives you total independence from SaaS middlemen."
  },
  {
    question: "Do I have to use my own AI keys and Cloud Storage?",
    answer: "Not at all! You only need to connect your social media accounts to start publishing. However, adding your own AI key unlocks our 'Vibe Sync' feature to instantly rewrite your captions, and connecting your own storage lets you easily organize your media without paying us a cent for hosting."
  },
  {
    question: <>Can I use <strong>Directly Social</strong> for team collaboration?</>,
    answer: "Team features are coming soon to our Cloud Pro tier, which will allow for shared local vaults and synchronized workflows while maintaining our privacy-first architecture."
  }
];

export const personas = {
  creator: {
    title: 'For the Native Creator',
    description: <>Focus on your craft, not the tech. <strong>Directly Social</strong> handles the complexity of platform APIs so you can publish everywhere with one click.</>,
    benefits: [
      'One-click distribution to TikTok, IG, YT',
      'AI Vibe Sync for automated tone shifting',
      'Native Proxy-Push for maximum reach',
      'Privacy-first local media vault'
    ]
  },
  powerUser: {
    title: 'For Power Users & Teams',
    description: <>Tired of closed SaaS ecosystems? <strong>Directly Social</strong> gives you total control. Build custom automations, connect your own infrastructure, and escape the SaaS tax.</>,
    benefits: [
      'BYOK & BYOS Architecture (Keys & Storage)',
      'Self-Hostable & Privacy-Hardened',
      'Custom Integrations & Workflows',
      'Full API Access for Automation'
    ]
  }
};

export const comparisonBad = {
  title: "Legacy Middlemen",
  items: [
    "The SaaS Tax: Forced monthly subscriptions ($50+/mo)",
    "Custody Risk: Your API keys live on their servers",
    "Storage Lock-in: Media is trapped in their cloud",
    "Middleware Latency: Slow API proxies and delays",
    "The Algorithmic Tax: Lower reach via indirect posts"
  ]
};

export const comparisonGood = {
  title: "Native Freedom",
  items: [
    "Zero Markup: Pay $0 for native distribution",
    "Total Ownership: Keys stay on your own device",
    "Storage Freedom (BYOS): Keep videos on your disk",
    "Studio Speed: Direct publishing, zero middlemen",
    "Maximum Reach: 100% Native Proxy-Push"
  ]
};

export const activePlatforms = ['tiktok', 'instagram', 'youtube', 'facebook'];
export const upcomingPlatforms = ['linkedin', 'threads', 'x', 'reddit'];

export const testimonials: any[] = [];
