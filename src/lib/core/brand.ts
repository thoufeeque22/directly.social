/**
 * Global Brand Configuration
 * 
 * Centralizing the brand name, tagline, and URLs allows for easy
 * rebranding or global updates across metadata, UI, and legal copy.
 * 
 * IMPORTANT: To rebrand, change ONLY the constants below.
 * Everything else derives from them automatically.
 */

/** The single source of truth for the brand name. */
const BRAND_NAME = 'directly.social';

/** The legal entity name shown in copyright notices and legal documents. */
const LEGAL_OWNER = 'Thoufeeque Abdul Rahman Rafique';

/** The primary domain (used for constructing URLs and email addresses). */
const DOMAIN = 'directly.social';

// Use Vercel URL for first launch, update to production domain later
const LAUNCH_URL = `https://${DOMAIN}`;

export const BRAND = {
  name: BRAND_NAME,
  shortName: BRAND_NAME,
  domain: DOMAIN,
  tagline: 'The Native Social Client',
  url: LAUNCH_URL,
  appStore: {
    apple: {
      title: `${BRAND_NAME}: Post Planner`,
      subtitle: 'Publish Videos Privately',
    },
    google: {
      title: `${BRAND_NAME}: Post Planner`,
      shortDescription:
        'Publish videos across platforms privately, keeping 100% control of your data.',
    },
  },
  social: {
    github: `https://github.com/thoufeeque22/${DOMAIN}`,
    twitter: 'https://x.com/directlysocial', // Placeholder
    discord: 'https://discord.gg/directly', // Placeholder
  },
  legal: {
    owner: LEGAL_OWNER,
    copyrightOwner: BRAND_NAME,
  },
} as const;

