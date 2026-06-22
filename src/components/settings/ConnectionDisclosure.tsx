import React from 'react';

interface ConnectionDisclosureProps {
  provider: string;
}

export const ConnectionDisclosure: React.FC<ConnectionDisclosureProps> = ({ provider }) => {
  if (provider === 'google') {
    return (
      <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', lineHeight: 1.4 }}>
        By connecting your YouTube account, you agree to be bound by the{' '}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--foreground))', textDecoration: 'underline' }}>
          YouTube Terms of Service
        </a>{' '}
        and acknowledge the{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--foreground))', textDecoration: 'underline' }}>
          Google Privacy Policy
        </a>
        . You can revoke this application&apos;s access to your data at any time via your{' '}
        <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--foreground))', textDecoration: 'underline' }}>
          Google Security Settings
        </a>
        .
      </p>
    );
  }

  if (provider === 'facebook') {
    return (
      <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', lineHeight: 1.4 }}>
        By connecting your Facebook or Instagram account, you agree to comply with the{' '}
        <a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--foreground))', textDecoration: 'underline' }}>
          Meta Platform Terms
        </a>{' '}
        and acknowledge our data processing practices.
      </p>
    );
  }

  if (provider === 'tiktok') {
    return (
      <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', lineHeight: 1.4 }}>
        By connecting your TikTok account, you agree to comply with the{' '}
        <a href="https://developers.tiktok.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--foreground))', textDecoration: 'underline' }}>
          TikTok Developer Terms
        </a>{' '}
        and acknowledge the{' '}
        <a href="https://developers.tiktok.com/doc/login-kit-branding-guidelines" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--foreground))', textDecoration: 'underline' }}>
          TikTok Login Kit Branding Guidelines
        </a>
        .
      </p>
    );
  }

  return null;
};
