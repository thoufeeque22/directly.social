import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { buildAuthorizationUrl } from '@/lib/platforms/linkedin/oauth';

const REDIRECT_URI_PATH = '/api/linkedin/oauth/callback';

/**
 * GET /api/linkedin/oauth/start
 * Generates the LinkedIn OAuth authorization URL server-side.
 * Keeps HMAC secret and client credentials out of the client bundle.
 */
export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const host = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const redirectUri = `${host}${REDIRECT_URI_PATH}`;
  const url = buildAuthorizationUrl(session.user.id, redirectUri);

  return NextResponse.json({ url });
}
