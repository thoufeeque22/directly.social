import { PlatformActivity } from "./types";
import { InstagramActivity } from "./instagram-activity";
import { YouTubeActivity } from "./youtube-activity";
import { TikTokActivity } from "./tiktok-activity";
import { FacebookActivity } from "./facebook-activity";
import { LinkedInActivity } from "./linkedin-activity";

/**
 * (OO-002): Factory Pattern for resolving platform-specific publishing activities.
 * (OO-001): Registry pattern to avoid OCP violations.
 */
class ActivityRegistry {
  private activities: Map<string, PlatformActivity> = new Map();

  register(platform: string, activity: PlatformActivity) {
    this.activities.set(platform.toLowerCase(), activity);
  }

  get(platform: string): PlatformActivity {
    const activity = this.activities.get(platform.toLowerCase());
    if (!activity) {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    return activity;
  }
}

const defaultRegistry = new ActivityRegistry();
defaultRegistry.register('instagram', new InstagramActivity());
defaultRegistry.register('youtube', new YouTubeActivity());
defaultRegistry.register('tiktok', new TikTokActivity());
defaultRegistry.register('facebook', new FacebookActivity());
defaultRegistry.register('linkedin', new LinkedInActivity());

export function getPlatformActivity(platform: string): PlatformActivity {
  return defaultRegistry.get(platform);
}
