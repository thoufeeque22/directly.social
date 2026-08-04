import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // "next" is passed as a query parameter (e.g. ?next=/dashboard)
  const next = requestUrl.searchParams.get('next') || '/';

  // Next.js dev server sometimes forces requestUrl.origin to localhost instead of app.localhost
  const hostHeader = request.headers.get('host');
  const protocol = hostHeader?.includes('localhost') ? 'http' : 'https';
  const trueOrigin = hostHeader ? `${protocol}://${hostHeader}` : requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Supabase Auth Callback Error:', error.message);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, trueOrigin));
    }
  }

  return NextResponse.redirect(new URL(next, trueOrigin));
}
