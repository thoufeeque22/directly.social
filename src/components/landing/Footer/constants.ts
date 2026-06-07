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
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Self-Hosting', href: '/docs/self-hosting' },
    ],
  },
  {
    title: 'Compare',
    links: [
      { label: 'vs Metricool', href: '/vs/metricool' },
      { label: 'vs Buffer', href: '/vs/buffer' },
      { label: 'vs Publer', href: '/vs/publer' },
      { label: 'vs Hootsuite', href: '/vs/hootsuite' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/docs/api' },
      { label: 'Open Source', href: 'https://github.com' },
      { label: 'Contributing', href: '/docs/contributing' },
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
