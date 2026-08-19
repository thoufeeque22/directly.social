import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/core/prisma";
import { Role } from "@prisma/client";

export interface Session {
  user: {
    id: string;
    role?: Role;
    aiCredits?: number;
    aiProcessingConsent?: boolean;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires?: string;
}

/**
 * SHIM: NextAuth has been replaced with @supabase/ssr.
 * This function preserves the `auth()` API contract for the 49+ files 
 * that still call it, seamlessly pulling the session from Supabase and 
 * hydrating the user data from Prisma to match the old NextAuth structure.
 */
export async function auth(): Promise<Session | null> {
  const { cookies } = await import('next/headers');
  
  if (process.env.E2E_TEST_MODE === 'true') {
    const cookieStore = await cookies();
    if (cookieStore.get('e2e-bypass')?.value === 'true') {
      return {
        user: {
          id: "e2e-test-user-id",
          role: "USER",
          name: "Test User",
          email: "tester@directly.social",
        }
      };
    }
  }

  if (process.env.ZAP_ENABLED === 'true') {
    const cookieStore = await cookies();
    if (cookieStore.get('zap-bypass')?.value === 'true') {
      return {
        user: {
          id: "zap-test-user-id",
          role: "USER",
          name: "ZAP Tester",
          email: "zap@directly.social",
        }
      };
    }
  }

  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock.supabase.co') {
    return null;
  }
  
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  let user;
  try {
    // NextAuth was configured with PrismaAdapter, meaning the DB 
    // users table is still the source of truth for app metadata.
    // We must look up by both ID (new users) and Email (migrated NextAuth users)
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: authUser.id },
          { email: authUser.email ?? undefined }
        ]
      }
    });

    // Auto-sync new Supabase users to Prisma if they don't exist yet
    if (!user && authUser.email) {
      user = await prisma.user.create({
        data: {
          id: authUser.id, // Use Supabase UUID for new Prisma users
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
          image: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
        }
      });
    }
  } catch (error) {
    // Graceful degradation: Log DB schema mismatches (e.g., missing columns during deployment)
    // to Sentry without crashing the entire SSR process.
    console.error('[Auth Error] Prisma DB sync failed:', error);
    // Return a minimal session using just Supabase data so the user isn't completely locked out/crashed
    return {
      user: {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
        image: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
      }
    };
  }

  if (!user) return null;

  return {
    user: {
      id: user.id,
      role: user.role,
      aiCredits: user.aiCredits ?? undefined,
      aiProcessingConsent: user.aiProcessingConsent ?? false,
      name: user.name,
      email: user.email,
      image: user.image,
    }
  };
}

// Stub for signOut since some client components might import it from @/auth
export async function signOut(options?: Record<string, unknown>) {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

// We remove signIn as that is typically imported from next-auth/react.
// If it was exported here, we just export a no-op or throw an error.
export async function signIn(provider?: string, options?: Record<string, unknown>) {
  throw new Error("signIn() from next-auth is deprecated. Use Supabase client.");
}
