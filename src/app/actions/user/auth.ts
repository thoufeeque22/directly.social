"use server";

import { signOut } from "@/auth";

export async function logOutAction() {
  await signOut({ redirect: false });
}
