/**
 * Global Brand Configuration
 * 
 * Centralizing the brand name, tagline, and URLs allows for easy
 * rebranding or global updates across metadata, UI, and legal copy.
 */

// Use Vercel URL for first launch, update to directly.social later
const LAUNCH_URL = 'https://directly-social.vercel.app';

export const BRAND = {
  name: 'Directly Social',
  shortName: 'Directly',
  tagline: 'The Native Social Client',
  url: LAUNCH_URL,
  appStore: {
    apple: {
      subtitle: 'Schedule & Post Natively',
    },
    google: {
      shortDescription:
        'Schedule and publish to social media platforms — with your own keys and storage.',
    },
  },
  social: {
    github: 'https://github.com/thoufeeque22/directly.social',
    twitter: 'https://x.com/directlysocial', // Placeholder
    discord: 'https://discord.gg/directly', // Placeholder
  },
  legal: {
    copyrightOwner: 'Directly Social',
  }
} as const;
