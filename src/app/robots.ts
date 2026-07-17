import { MetadataRoute } from 'next';
import { BRAND } from '../lib/core/brand';

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_APP_ENV === 'staging') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${BRAND.url}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/activity',
        '/admin',
        '/api',
        '/media',
        '/schedule',
        '/settings',
        '/login',
        '/auth',
      ],
    },
    sitemap: `${BRAND.url}/sitemap.xml`,
  };
}
