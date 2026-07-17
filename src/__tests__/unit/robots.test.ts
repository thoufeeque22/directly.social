import { describe, it, expect, afterEach } from 'vitest';
import robots from '../../../src/app/robots';

describe('robots.txt configuration', () => {
  const originalEnv = process.env.NEXT_PUBLIC_APP_ENV;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_APP_ENV;
    } else {
      process.env.NEXT_PUBLIC_APP_ENV = originalEnv;
    }
  });

  it('disallows everything in staging environment', () => {
    process.env.NEXT_PUBLIC_APP_ENV = 'staging';
    const config = robots();
    
    expect(config.rules).toEqual({
      userAgent: '*',
      disallow: '/',
    });
  });

  it('allows specific routes in production environment', () => {
    process.env.NEXT_PUBLIC_APP_ENV = 'production';
    const config = robots();
    
    expect(config.rules).toEqual({
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
    });
  });
});
