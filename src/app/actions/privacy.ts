"use server";

import { protectedAction } from "@/lib/core/action-utils";
import { PrivacyService } from "@/lib/services/privacy";
import { revalidatePath } from "next/cache";

const privacyService = new PrivacyService();

/**
 * Server action to request a data export.
 */
export async function requestDataExportAction() {
  return protectedAction(async function requestExport(userId) {
    await privacyService.requestDataExport(userId);
    return { success: true, message: "Data export requested. You will receive an email shortly." };
  });
}

/**
 * Server action to delete the user account.
 * This is a destructive action.
 */
export async function deleteAccountAction() {
  return protectedAction(async function deleteAccount(userId) {
    await privacyService.executeAccountDeletion(userId);
    // After deletion, the session will be invalid. 
    // The client should redirect to logout or home.
    revalidatePath("/");
    return { success: true };
  });
}
