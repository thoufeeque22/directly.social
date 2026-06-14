import { Inngest } from "inngest";

/**
 * (OO-001): Centralized Inngest client for durable workflow orchestration.
 * Adheres to the Singleton pattern for the event bus.
 */
export const inngest = new Inngest({ 
  id: "social-studio-app"
});
