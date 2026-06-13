"use server";

import { protectedAction } from "@/lib/core/action-utils";
import { PrivacyService } from "@/lib/services/privacy";
import { PrivacyExportHelper } from "@/lib/services/privacy-export";
import { revalidatePath } from "next/cache";

const privacyService = new PrivacyService();

/**
 * Server action to generate and download a data export.
 */
export async function downloadDataExportAction() {
  return protectedAction(async function downloadExport(userId) {
    const data = await PrivacyExportHelper.getExportData(userId);
    return { success: true, data };
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
