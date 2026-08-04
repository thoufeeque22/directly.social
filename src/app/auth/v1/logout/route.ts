import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get('next') || '/login';
  
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
