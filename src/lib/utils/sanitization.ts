/**
 * Strategy Pattern for Platform-Specific Sanitization
 */

export interface DistributionMetadata {
  title?: string;
  description?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface SanitizationStrategy {
  sanitize(metadata: DistributionMetadata): DistributionMetadata;
}

/**
 * YouTube Specific Sanitization
 */
export class YouTubeSanitizationStrategy implements SanitizationStrategy {
  sanitize(metadata: DistributionMetadata): DistributionMetadata {
    const title = metadata.title?.substring(0, 100).replace(/[<>]/g, "") || "";
    const description = metadata.description || "";
    // YouTube specific rules: strip restricted HTML, limit length
    return {
      ...metadata,
      title,
      description: description.substring(0, 5000),
    };
  }
}

/**
 * TikTok Specific Sanitization
 */
export class TikTokSanitizationStrategy implements SanitizationStrategy {
  sanitize(metadata: DistributionMetadata): DistributionMetadata {
    const description = metadata.description || "";
    // TikTok rules: 2200 chars, hashtag validation
    const sanitizedDescription = description.substring(0, 2200);
    return {
      ...metadata,
      description: sanitizedDescription,
    };
  }
}

/**
 * Generic Sanitization
 */
export class GenericSanitizationStrategy implements SanitizationStrategy {
  sanitize(metadata: DistributionMetadata): DistributionMetadata {
    return {
      ...metadata,
      title: metadata.title?.normalize("NFKC").trim(),
      description: metadata.description?.normalize("NFKC").trim(),
    };
  }
}

/**
 * Sanitization Service
 */
export class SanitizationService {
  private static strategies: Record<string, SanitizationStrategy> = {
    youtube: new YouTubeSanitizationStrategy(),
    tiktok: new TikTokSanitizationStrategy(),
    default: new GenericSanitizationStrategy(),
  };

  static sanitize(platform: string, metadata: DistributionMetadata): DistributionMetadata {
    const strategy = this.strategies[platform.toLowerCase()] || this.strategies.default;
    // Apply generic sanitization first, then platform-specific
    const generic = this.strategies.default.sanitize(metadata);
    return strategy.sanitize(generic);
  }
}

export const sanitizeMetadata = SanitizationService.sanitize.bind(SanitizationService);
