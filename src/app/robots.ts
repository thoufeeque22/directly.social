import { MetadataRoute } from 'next';
import { BRAND } from '../lib/core/brand';

export default function robots(): MetadataRoute.Robots {
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
