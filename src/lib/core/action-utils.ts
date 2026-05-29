import { auth } from "@/auth";
import { logger } from "./logger";
import { Session } from "next-auth";

/**
 * A wrapper for server actions that requires authentication.
 * Handles session verification and provides a consistent error format.
 */
export async function protectedAction<T>(
  action: (userId: string, session: Session) => Promise<T>
): Promise<T> {
  const actionName = action.name || 'anonymous';
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error(`Unauthorized: ${actionName}`);
  }

  try {
    return await action(session.user.id, session);
  } catch (error: unknown) {
    console.trace("Server Action Error Trace");
    logger.error(`Server Action Error in ${actionName}`, error);
    
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred.");
  }
}

/**
 * Handles common path revalidations for the dashboard.
 */
export async function revalidateDashboard() {
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath("/");
    revalidatePath("/settings");
    revalidatePath("/activity");
    revalidatePath("/schedule");
  } catch (error) {
    logger.warn("Revalidation failed (non-critical)", error);
  }
}
