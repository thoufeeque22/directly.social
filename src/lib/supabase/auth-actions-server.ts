'use server';

import { createClient } from './server';

/**
 * Server Action to securely clear HttpOnly cookies during sign out.
 */
export async function serverSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
