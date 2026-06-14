export interface VideoPublishEvent {
  name: "video.publish";
  data: {
    activityId: string;
    platform: string;
    accountId: string;
    userId: string;
    stagedFileId: string;
    title: string;
    description: string;
    videoFormat: "short" | "long";
    reviewedContent?: Record<string, { title: string; description: string; hashtags?: string[] }>;
  };
}

/**
 * (API-001): Strongly typed event schemas for Inngest.
 */
export type Events = {
  "video.publish": VideoPublishEvent;
};
