export const SYSTEM_METRICS = {
  USAGE: {
    AI_CHATBOT: "feature:usage:ai_chatbot",
    CALENDAR: "feature:usage:calendar",
    SNIPPETS: "feature:usage:snippets",
    GLOBAL_SEARCH: "feature:usage:global_search",
    MEDIA_PICKER: "feature:usage:media_picker",
    MANUAL_MODE: "feature:usage:manual_mode",
  },
  PLATFORM: {
    SUCCESS: (platform: string) => `platform:success:${platform}`,
    ERROR: (platform: string) => `platform:error:${platform}`,
  },
  CONSUMPTION: {
    GOOGLE: "api:consumption:google",
    SENTRY: "api:consumption:sentry",
  }
} as const;

export const FEATURE_LABELS: Record<string, string> = {
  [SYSTEM_METRICS.USAGE.AI_CHATBOT]: "AI Chatbot",
  [SYSTEM_METRICS.USAGE.CALENDAR]: "Calendar",
  [SYSTEM_METRICS.USAGE.SNIPPETS]: "Snippets",
  [SYSTEM_METRICS.USAGE.GLOBAL_SEARCH]: "Search",
  [SYSTEM_METRICS.USAGE.MEDIA_PICKER]: "Media Picker",
  [SYSTEM_METRICS.USAGE.MANUAL_MODE]: "Manual Mode",
};
