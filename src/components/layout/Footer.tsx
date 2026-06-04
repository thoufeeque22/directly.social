import React from 'react';
import styles from './Footer.module.css';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export function Footer() {
  const columns: FooterColumn[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Roadmap', href: '#' },
        { label: 'Changelog', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookie Policy', href: '#' },
      ],
    },
  ];

  return (
    <footer className={styles.globalFooter}>
      <div className={styles.footerGrid}>
        {columns.map((column, idx) => (
          <div key={idx} className={styles.footerColumn}>
            <h4 className={styles.footerLabel}>{column.title}</h4>
            <ul className={styles.footerLinks}>
              {column.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 Directly. All rights reserved.</p>
      </div>
    </footer>
  );
}
