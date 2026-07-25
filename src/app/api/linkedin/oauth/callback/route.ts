import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { verifyOAuthState, exchangeCodeForTokens } from '@/lib/platforms/linkedin/oauth';
import { encryptLinkedInToken } from '@/lib/platforms/linkedin/encrypt';
import { fetchLinkedInProfile, buildMemberUrn } from '@/lib/platforms/linkedin/client';

/**
 * GET /api/linkedin/oauth/callback
 * Handles the OAuth 2.0 Authorization Code callback from LinkedIn.
 * - Verifies state nonce (anti-replay)
 * - Exchanges code for token set
 * - Encrypts tokens at rest (AES-256-GCM)
 * - Upserts Account record in DB
 * - Redirects to settings page
 */
export async function GET(req: Request): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/settings?tab=destinations&linkedin_error=${error}`, req.url),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/settings?tab=destinations&linkedin_error=missing_params', req.url),
    );
  }

  try {
    verifyOAuthState(state);
  } catch {
    return NextResponse.redirect(
      new URL('/settings?tab=destinations&linkedin_error=invalid_state', req.url),
    );
  }

  const redirectUri = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/api/linkedin/oauth/callback`;

  const tokens = await exchangeCodeForTokens(code, redirectUri);
  const profile = await fetchLinkedInProfile(tokens.accessToken);

  const encryptedAccess = encryptLinkedInToken(tokens.accessToken);
  const encryptedRefresh = encryptLinkedInToken(tokens.refreshToken);

  await prisma.account.upsert({
    where: { provider_providerAccountId: { provider: 'linkedin', providerAccountId: profile.sub } },
    create: {
      userId: session.user.id,
      type: 'oauth',
      provider: 'linkedin',
      providerAccountId: profile.sub,
      access_token: encryptedAccess,
      refresh_token: encryptedRefresh,
      expires_at: tokens.expiresAt,
      accountName: profile.name,
      scope: 'openid profile email w_member_social r_liteprofile',
    },
    update: {
      access_token: encryptedAccess,
      refresh_token: encryptedRefresh,
      expires_at: tokens.expiresAt,
      accountName: profile.name,
    },
  });

  void buildMemberUrn(profile.sub);
  return NextResponse.redirect(
    new URL('/settings?tab=destinations&linkedin_connected=true', req.url),
  );
}
