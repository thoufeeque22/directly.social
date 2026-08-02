import { createClient } from './client';
import type { Provider } from '@supabase/supabase-js';

export async function signIn(provider: string, options?: Record<string, unknown>): Promise<{ ok: boolean, error: string | null, status: number }> {
  const supabase = createClient();
  const callbackUrl = typeof options?.callbackUrl === 'string' ? options.callbackUrl : undefined;

  if (provider === 'credentials') {
    if (process.env.NEXT_PUBLIC_E2E === 'true') {
      document.cookie = "e2e-bypass=true; path=/";
      return { ok: true, error: null, status: 200 };
    } else {
      const email = typeof options?.email === 'string' ? options.email : '';
      const password = typeof options?.password === 'string' ? options.password : '';
      if (email && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { ok: false, error: error.message, status: 401 };
        }
      }
      return { ok: true, error: null, status: 200 };
    }
  }

  const oauthProviders = ['google', 'facebook', 'tiktok', 'linkedin', 'twitter'];
  
  if (oauthProviders.includes(provider)) {
    if (process.env.NEXT_PUBLIC_E2E === 'true') {
      console.log(`[E2E Mock] signIn called for provider: ${provider}`);
      return { ok: true, error: null, status: 200 };
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // User is already logged in, link this new identity
      await supabase.auth.linkIdentity({ provider: provider as Provider, options: { redirectTo: callbackUrl } });
    } else {
      // New login flow
      if (provider !== 'google') {
        throw new Error(`Only Google authentication is allowed for new sign-ins. Connect your ${provider} account from settings after logging in.`);
      }
      // TypeScript correctly infers Provider type here
      await supabase.auth.signInWithOAuth({ provider: provider as Provider, options: { redirectTo: callbackUrl } });
    }
    return { ok: true, error: null, status: 200 };
  }

  console.warn(`signIn called with unsupported provider: ${provider}`);
  return { ok: true, error: null, status: 200 };
}

export async function signOut(options?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_E2E === 'true') {
    document.cookie = "e2e-bypass=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } else {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
  
  if (options?.callbackUrl && typeof options.callbackUrl === 'string') {
    window.location.href = options.callbackUrl;
  } else {
    window.location.href = '/login';
  }
}
