import { Inngest } from "inngest";
import { Events } from "./events";

/**
 * (OO-001): Centralized Inngest client for durable workflow orchestration.
 * Adheres to the Singleton pattern for the event bus.
 */
export const inngest = new Inngest({ 
  id: "social-studio-app",
  schemas: [] as any // v4 often uses an array of schemas, or we can just skip for now and type the functions
});
