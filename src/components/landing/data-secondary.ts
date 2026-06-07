export const faqs = [
  {
    question: "What does 'Native' actually mean?",
    answer: "Most social media tools act as a middleman. They store your data and passwords on their servers and then send them to the platforms. Directly Social connects your computer directly to the platforms using their official APIs, meaning your data never leaves your control."
  },
  {
    question: "Is Directly Social really free?",
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
    question: "Can I use Directly Social for team collaboration?",
    answer: "Team features are coming soon to our Cloud Pro tier, which will allow for shared local vaults and synchronized workflows while maintaining our privacy-first architecture."
  }
];

export const personas = {
  creator: {
    title: 'For the Native Creator',
    description: 'Focus on your craft, not the tech. Directly handles the complexity of platform APIs so you can publish everywhere with one click.',
    benefits: [
      'One-click distribution to TikTok, IG, YT',
      'AI Vibe Sync for automated tone shifting',
      'Trending music discovery and sound-check',
      'Privacy-first local media vault'
    ]
  },
  developer: {
    title: 'For the Self-Hoster & Dev',
    description: 'Tired of closed SaaS ecosystems? Directly is open-core, extensible, and designed for those who want to own their infrastructure.',
    benefits: [
      'Bring-Your-Own-Key (BYOK) architecture',
      'Self-hostable or Local-only execution',
      'Extensible platform adapter system',
      'Zero-latency direct API integration'
    ]
  }
};

export const testimonials = [
  {
    name: 'Sarah J.',
    role: 'Lifestyle Creator',
    content: 'Switching from Buffer to Directly Social saved me $40/month and my videos actually go live instantly. The AI tone shifter is magic.',
    avatar: 'S'
  },
  {
    name: 'Mike D.',
    role: 'Tech YouTuber',
    content: 'As a developer, I love that I can own my data and use my own API keys. No middleware means no security risks.',
    avatar: 'M'
  },
  {
    name: 'Elena R.',
    role: 'Social Media Manager',
    content: 'The unified inbox being local-first is a game changer for client privacy. Best social tool of the year.',
    avatar: 'E'
  },
  {
    name: 'David W.',
    role: 'Growth Hacker',
    content: 'Native publishing means I never hit those weird rate limits or delays. My content goes viral while others are still uploading.',
    avatar: 'D'
  }
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

export const activePlatforms = ['tiktok', 'instagram', 'youtube', 'facebook'];
export const upcomingPlatforms = ['linkedin', 'threads', 'x', 'reddit'];
