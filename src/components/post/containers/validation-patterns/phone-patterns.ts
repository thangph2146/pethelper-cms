import type { PhonePatternConfig } from './interfaces/patterns';

export const PHONE_PATTERNS: PhonePatternConfig = {
  vietnam: {
    mobile: /^(\+84|84|0)[35789][0-9]{8}$/,
    landline: /^(\+84|84|0)[2][0-9]{9}$/
  },
  international: {
    e164: /^\+[1-9]\d{1,14}$/,
    basic: /^[0-9]{6,15}$/
  }
} as const; 