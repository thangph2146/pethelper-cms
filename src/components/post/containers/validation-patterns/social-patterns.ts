import type { SocialPatternConfig } from './interfaces';

export const SOCIAL_PATTERNS: SocialPatternConfig = {
  facebook: {
    profile: /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/[a-zA-Z0-9.]+$/,
    page: /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/pages\/[a-zA-Z0-9.-]+$/,
    group: /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/groups\/[a-zA-Z0-9.-]+$/
  },
  twitter: /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/[a-zA-Z0-9_]+$/,
  instagram: /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+$/
} as const; 