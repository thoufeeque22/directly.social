import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/core/prisma';
import { verifyOAuthState, exchangeCodeForTokens } from '@/lib/platforms/linkedin/oauth';
import { encryptLinkedInToken } from '@/lib/platforms/linkedin/encrypt';
import { fetchLinkedInProfile, buildMemberUrn } from '@/lib/platforms/linkedin/client';

const SETTINGS_URL = '/settings?tab=destinations';

/**
 * GET /api/linkedin/oauth/callback
 * Handles the OAuth 2.0 Authorization Code callback from LinkedIn.
 *
 * NOTE: We intentionally do NOT call auth() here. When LinkedIn redirects
 * the browser back from an external domain, SameSite cookie policies can
 * prevent the session cookie from being forwarded, causing auth() to return
 * null even for a logged-in user. Instead, the userId is safely extracted
 * from the HMAC-signed state nonce (anti-replay, Security Checklist #7).
 */
export async function GET(req: NextRequest): Promise<Response> {
  const url = req.nextUrl;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  const hostname = req.headers.get('host') || url.host;
  const protocol = req.headers.get('x-forwarded-proto') ?? (hostname.includes('localhost') ? 'http' : 'https');
  const base = `${protocol}://${hostname}`;

  // Make sure we redirect the browser back to the application subdomain,
  // since the callback might have landed on the root domain (which proxy.ts treats as marketing)
  let finalRedirectHost = base;
  if (finalRedirectHost.includes('localhost') && !finalRedirectHost.includes('app.localhost')) {
    finalRedirectHost = finalRedirectHost.replace('localhost', 'app.localhost');
  } else if (!finalRedirectHost.includes('app.') && finalRedirectHost.includes('directly.social')) {
    finalRedirectHost = finalRedirectHost.replace('https://', 'https://app.');
  }

  if (error) {
    return NextResponse.redirect(`${finalRedirectHost}${SETTINGS_URL}&linkedin_error=${error}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${finalRedirectHost}${SETTINGS_URL}&linkedin_error=missing_params`);
  }

  let userId: string;
  try {
    userId = verifyOAuthState(state);
  } catch {
    return NextResponse.redirect(`${finalRedirectHost}${SETTINGS_URL}&linkedin_error=invalid_state`);
  }

  try {
    // Use NEXTAUTH_URL strictly to match the LinkedIn Developer Console whitelist
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/linkedin/oauth/callback`;

    const tokens = await exchangeCodeForTokens(code, redirectUri);
    const profile = await fetchLinkedInProfile(tokens.accessToken);

    const encryptedAccess = encryptLinkedInToken(tokens.accessToken);
    const encryptedRefresh = encryptLinkedInToken(tokens.refreshToken ?? '');

    await prisma.account.upsert({
      where: { provider_providerAccountId: { provider: 'linkedin', providerAccountId: profile.sub } },
      create: {
        userId,
        type: 'oauth',
        provider: 'linkedin',
        providerAccountId: profile.sub,
        access_token: encryptedAccess,
        refresh_token: encryptedRefresh,
        expires_at: tokens.expiresAt,
        accountName: profile.name,
        scope: 'openid profile email w_member_social',
      },
      update: {
        userId,
        access_token: encryptedAccess,
        refresh_token: encryptedRefresh,
        expires_at: tokens.expiresAt,
        accountName: profile.name,
        scope: 'openid profile email w_member_social',
      },
    });

    void buildMemberUrn(profile.sub);
    console.log(`[LINKEDIN-CALLBACK] ✅ Connected LinkedIn for user ${userId} (${profile.name})`);
    
    try {
      const { revalidateDashboard } = await import('@/lib/core/action-utils');
      await revalidateDashboard();
    } catch (e) {
      console.error('Failed to revalidate dashboard', e);
    }

    return NextResponse.redirect(`${finalRedirectHost}${SETTINGS_URL}&linkedin_connected=true`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[LINKEDIN-CALLBACK] ❌ Error:', message);

    // Sanitize Prisma errors to prevent leaking DB structure in URLs
    let safeError = 'internal_error';
    if (message.includes('Foreign key constraint violated') || message.includes('P2003')) {
      safeError = 'user_not_found';
    } else if (message.includes('Invalid OAuth state')) {
      safeError = 'invalid_state';
    } else {
      // For standard API errors, just encode the first line to keep URL clean
      safeError = encodeURIComponent(message.split('\n')[0].substring(0, 50));
    }

    return NextResponse.redirect(`${finalRedirectHost}${SETTINGS_URL}&linkedin_error=${safeError}`);
  }
}
