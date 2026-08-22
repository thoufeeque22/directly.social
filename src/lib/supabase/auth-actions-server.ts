'use server';

import { createClient } from './server';

/**
 * Server Action to securely clear HttpOnly cookies during sign out.
 */
export async function serverSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/**
 * Server Action to sign out all other devices.
 */
export async function signOutOtherDevices() {
  if (process.env.E2E_TEST_MODE === 'true') {
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: 'others' });
  if (error) throw error;
}
