/**
 * /api/zap/auth — Staging-only ZAP Authentication Endpoint
 *
 * This route issues a valid NextAuth session cookie for the dedicated ZAP
 * test user (zap@directly.social). It is ONLY active when ZAP_ENABLED=true
 * is set in the staging environment — it is completely absent in production.
 *
 * ZAP calls this endpoint at the start of a scan, captures the Set-Cookie
 * header (authjs.session-token), and injects it into every subsequent request.
 *
 * Security Controls:
 *   1. ZAP_ENABLED=true guard — endpoint returns 404 in production
 *   2. ZAP_AUTH_SECRET shared secret — prevents unauthorized use
 *   3. Scoped to a dedicated low-privilege test user only
 *   4. Rate-limited by the existing Upstash Redis middleware
 */

import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import { cookies } from "next/headers";
import { z } from "zod";

const RequestSchema = z.object({
  email: z.string().email(),
  zapSecret: z.string().min(32),
});

export async function POST(request: Request): Promise<NextResponse> {
  // Guard: completely disable in non-ZAP environments
  if (process.env.ZAP_ENABLED !== "true") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const expectedSecret = process.env.ZAP_AUTH_SECRET;
  if (!expectedSecret) {
    console.error("[ZAP Auth] ZAP_AUTH_SECRET is not configured on staging.");
    return NextResponse.json(
      { error: "ZAP auth is misconfigured" },
      { status: 500 },
    );
  }

  // Parse + validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, zapSecret } = parsed.data;

  // Verify the shared secret
  if (zapSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only allow the designated ZAP test user — no other accounts
  if (email !== "zap@directly.social") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Use NextAuth's signIn with the ZAP credentials provider.
    // This is gated by ZAP_ENABLED in src/auth.ts — the provider only
    // exists when this env var is set.
    await signIn("zap-credentials", {
      email,
      zapSecret,
      redirect: false,
    });

    // Read the session cookie that NextAuth just set
    const cookieStore = await cookies();
    const sessionCookieName = process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
    const sessionToken = cookieStore.get(sessionCookieName);

    if (!sessionToken) {
      console.error("[ZAP Auth] Session cookie not found after signIn.");
      return NextResponse.json(
        { error: "Authentication failed — no session created" },
        { status: 500 },
      );
    }

    // Return the session token in the response body too (ZAP can use either)
    return NextResponse.json(
      { ok: true, user: "zap@directly.social" },
      {
        status: 200,
        headers: {
          // Propagate the cookie explicitly so ZAP captures it from the response
          "Set-Cookie": `${sessionCookieName}=${sessionToken.value}; Path=/; HttpOnly; SameSite=Lax`,
        },
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ZAP Auth] Sign-in failed:", message);
    return NextResponse.json(
      { error: "Authentication failed", detail: message },
      { status: 401 },
    );
  }
}

// Block all other HTTP methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
