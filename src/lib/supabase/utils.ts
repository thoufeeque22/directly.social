export function getCookieDomain(): string | undefined {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname.endsWith('.localhost')) return undefined;
    if (hostname.includes('staging.')) return '.staging.directly.social';
    return '.directly.social';
  }
  
  // Server-side
  const url = process.env.NEXT_PUBLIC_SITE_URL || '';
  if (url.includes('localhost')) return undefined;
  if (url.includes('staging.')) return '.staging.directly.social';
  return '.directly.social';
}
