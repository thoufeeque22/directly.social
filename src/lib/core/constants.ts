export const PLATFORMS = [
  { id: 'youtube', provider: 'google', name: 'YouTube Shorts', icon: '📺', color: 'hsl(var(--primary))', status: 'active' },
  { id: 'instagram', provider: 'facebook', name: 'Instagram Reels', icon: '📸', color: '#E1306C', status: 'active' },
  { id: 'tiktok', provider: 'tiktok', name: 'TikTok', icon: '🎵', color: 'black', status: 'active' },
  { id: 'facebook', provider: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2', status: 'active' },
  { id: 'linkedin', provider: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2', status: 'coming-soon' },
  { id: 'twitter', provider: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'white', status: 'coming-soon' },
  { id: 'pinterest', provider: 'pinterest', name: 'Pinterest', icon: '📌', color: '#E60023', status: 'coming-soon' },
  { id: 'threads', provider: 'threads', name: 'Threads', icon: '🧵', color: 'black', status: 'coming-soon' },
] as const;

export type PlatformStatus = 'active' | 'coming-soon';
export type Platform = typeof PLATFORMS[number];

export type AITier = 'Manual' | 'Enrich' | 'Generate';
export type StyleMode = 'Smart' | 'Gen-Z' | 'SEO' | 'Story' | 'Custom';

export const AI_TIERS: AITier[] = ['Manual', 'Enrich', 'Generate'];
export const STYLE_MODES: StyleMode[] = ['Smart', 'Gen-Z', 'SEO', 'Story', 'Custom'];

export const GEMINI_FALLBACK_MODELS = [
  "gemini-3-flash-preview",
  "gemini-3.1-pro-preview",
  "gemini-3-pro-preview",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-2.0-flash"
];

export const OLLAMA_DEFAULT_BASE_URL = "http://localhost:11434";
export const OLLAMA_DEFAULT_MODEL = "gemma4";

// Storage Quotas
export const MAX_STORAGE_PER_USER = 2 * 1024 * 1024 * 1024; // 2GB in bytes
