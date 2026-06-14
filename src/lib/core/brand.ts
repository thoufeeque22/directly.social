/**
 * Global Brand Configuration
 * 
 * Centralizing the brand name, tagline, and URLs allows for easy
 * rebranding or global updates across metadata, UI, and legal copy.
 */

export const BRAND = {
  name: 'Directly Social',
  shortName: 'Directly',
  tagline: 'The Native Social Client',
  url: 'https://directly.social', // Primary domain (placeholder)
  vercelUrl: 'https://directly-social.vercel.app', // Vercel deployment
  social: {
    github: 'https://github.com/thoufeeque22/directly.social',
    twitter: 'https://x.com/directlysocial', // Placeholder
    discord: 'https://discord.gg/directly', // Placeholder
  },
  legal: {
    copyrightOwner: 'Directly Social',
  }
} as const;
