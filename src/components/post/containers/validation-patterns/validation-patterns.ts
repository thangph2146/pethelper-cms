import type { ValidationPatternConfig } from './interfaces';
import { URL_PATTERNS } from './url-patterns';
import { SOCIAL_PATTERNS } from './social-patterns';
import { EMAIL_PATTERNS } from './email-patterns';
import { PHONE_PATTERNS } from './phone-patterns';

export const VALIDATION_PATTERNS: ValidationPatternConfig = {
  url: URL_PATTERNS,
  social: SOCIAL_PATTERNS,
  email: EMAIL_PATTERNS,
  phone: PHONE_PATTERNS
} as const; 