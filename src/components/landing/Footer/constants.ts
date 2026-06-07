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
      { label: 'BYOK Setup Guide', href: '/docs#configuration-byok' },
      { label: 'Local Vault Guide', href: '/docs#getting-started' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Why Directly Social?', href: '/philosophy' },
      { label: 'System Status', href: '#' },
      { label: 'Contact Support', href: 'mailto:support@directly.social' },
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
