import type { EmailPatternConfig } from './interfaces/patterns';

export const EMAIL_PATTERNS: EmailPatternConfig = {
  basic: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  strict: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  gmail: /^[a-zA-Z0-9._%+-]+@gmail\.com$/
} as const; 