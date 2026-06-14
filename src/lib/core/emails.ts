/**
 * Operational and Support Email Configuration
 * 
 * Centralizing these addresses makes it easier to update them when the 
 * custom domain (directly.social) is acquired or when migrating to 
 * different support/legal/privacy mailboxes.
 */

const BASE_EMAIL = 'support.directly.social@gmail.com';

export const CONTACT_EMAILS = {
  support: BASE_EMAIL,
  hello: BASE_EMAIL,
  privacy: BASE_EMAIL,
  legal: BASE_EMAIL,
  alerts: BASE_EMAIL,
} as const;
