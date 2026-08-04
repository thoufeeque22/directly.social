import { createBrowserClient } from '@supabase/ssr';
import { getCookieDomain } from './utils';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
    {
      cookieOptions: {
        domain: getCookieDomain(),
      }
    }
  );
}
