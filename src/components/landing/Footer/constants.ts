import { CONTACT_EMAILS } from '@/lib/core/emails';
import { BRAND } from '@/lib/core/brand';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumnData {
  title: string;
  links: FooterLink[];
}

export const FOOTER_COLUMNS: FooterColumnData[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Native Proxy-Push', href: '/philosophy' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'BYOK Setup Guide', href: '/docs/byok-guide' },
      { label: 'Local Vault Guide', href: '/docs/vault-setup' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: `Why ${BRAND.name}?`, href: '/philosophy' },
      { label: 'System Status', href: '#' },
      { label: 'Contact Support', href: `mailto:${CONTACT_EMAILS.support}` },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];
