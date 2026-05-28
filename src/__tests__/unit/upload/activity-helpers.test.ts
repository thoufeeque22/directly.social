import { describe, it, expect } from "vitest";
import { buildInitialPlatformData, getFinalScheduledAt } from "@/lib/upload/activity-helpers";

describe("activity-helpers", () => {
  describe("buildInitialPlatformData", () => {
    it("should return an empty array if platforms is null or undefined", () => {
      expect(buildInitialPlatformData(null, {})).toEqual([]);
      expect(buildInitialPlatformData(undefined, {})).toEqual([]);
    });

    it("should map platforms correctly with transcode status", () => {
      const platforms = [
        { platform: "youtube", accountId: "yt1" },
        { platform: "tiktok", accountId: "tt1" },
      ];
      const transcodeResults = {
        youtube: { needsTranscode: true },
        tiktok: { needsTranscode: false },
      };

      const result = buildInitialPlatformData(platforms, transcodeResults);

      expect(result).toEqual([
        {
          platform: "youtube",
          accountId: "yt1",
          status: "pending",
          transcodeStatus: "pending",
        },
        {
          platform: "tiktok",
          accountId: "tt1",
          status: "pending",
          transcodeStatus: "skipped",
        },
      ]);
    });

    it("should set transcodeStatus to skipped if platform is missing in transcodeResults", () => {
      const platforms = [{ platform: "youtube", accountId: "yt1" }];
      const result = buildInitialPlatformData(platforms, {});

      expect(result[0].transcodeStatus).toBe("skipped");
    });
  });

  describe("getFinalScheduledAt", () => {
    it("should return the parsed date if scheduledAt is valid", () => {
      const dateStr = "2024-12-25T10:00:00Z";
      const result = getFinalScheduledAt(dateStr);
      expect(result.toISOString()).toBe(new Date(dateStr).toISOString());
    });

    it("should return the current date if scheduledAt is invalid or null", () => {
      const before = new Date().getTime();
      const result = getFinalScheduledAt("invalid-date");
      const after = new Date().getTime();
      
      expect(result.getTime()).toBeGreaterThanOrEqual(before);
      expect(result.getTime()).toBeLessThanOrEqual(after);
    });

    it("should return the current date if scheduledAt is null or undefined", () => {
      const before = new Date().getTime();
      const result = getFinalScheduledAt(null);
      const after = new Date().getTime();
      
      expect(result.getTime()).toBeGreaterThanOrEqual(before);
      expect(result.getTime()).toBeLessThanOrEqual(after);
    });
  });
});
