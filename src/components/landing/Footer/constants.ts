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
      { label: 'Why Directly Social?', href: '/philosophy' },
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
