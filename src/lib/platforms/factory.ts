import { PlatformActivity } from "./types";
import { InstagramActivity } from "./instagram-activity";
import { YouTubeActivity } from "./youtube-activity";
import { TikTokActivity } from "./tiktok-activity";
import { FacebookActivity } from "./facebook-activity";

/**
 * (OO-002): Factory Pattern for resolving platform-specific publishing activities.
 * (OO-001): Registry pattern to avoid OCP violations.
 */
class ActivityRegistry {
  private static activities: Map<string, PlatformActivity> = new Map();

  static register(platform: string, activity: PlatformActivity) {
    this.activities.set(platform.toLowerCase(), activity);
  }

  static get(platform: string): PlatformActivity {
    const activity = this.activities.get(platform.toLowerCase());
    if (!activity) {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    return activity;
  }
}

// Register default platforms
ActivityRegistry.register('instagram', new InstagramActivity());
ActivityRegistry.register('youtube', new YouTubeActivity());
ActivityRegistry.register('tiktok', new TikTokActivity());
ActivityRegistry.register('facebook', new FacebookActivity());

export function getPlatformActivity(platform: string): PlatformActivity {
  return ActivityRegistry.get(platform);
}
