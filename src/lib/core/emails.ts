/**
 * Operational and Support Email Configuration
 * 
 * All addresses derive from the centralized BRAND.domain constant.
 * To update the domain, change it in brand.ts — these update automatically.
 */

import { BRAND } from './brand';

const d = BRAND.domain;

export const CONTACT_EMAILS = {
  support: `support@${d}`,
  hello: `hello@${d}`,
  privacy: `privacy@${d}`,
  legal: `legal@${d}`,
  alerts: `alerts@${d}`,
  billing: `billing@${d}`,
  admin: `admin@${d}`,
} as const;

