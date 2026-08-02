import { PLATFORMS } from "@/lib/core/constants";

export class PlatformCapabilityService {
  getCapabilities(isFree: boolean) {
    return PLATFORMS.map(p => ({
      ...p,
      canToggle: p.id !== 'tiktok',
      isLocked: false,
    }));
  }
}
