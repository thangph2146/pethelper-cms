import { VALIDATION_PATTERNS } from '../validation-patterns';
import { VALIDATION_ERRORS } from '../validation-errors';

export type SocialPlatform = keyof typeof VALIDATION_PATTERNS.social;

export const validateSocialMedia = (
  value: string,
  platform: SocialPlatform,
  fieldName: string
): string[] => {
  if (!value) return [];

  const pattern = VALIDATION_PATTERNS.social[platform];
  
  if (!pattern.test(value)) {
    return [VALIDATION_ERRORS.field.invalidSocialMedia(fieldName, platform)];
  }
  return [];
};

export const validateSocialLinks = (
  links: Partial<Record<SocialPlatform, string>>,
  fieldName: string
): string[] => {
  const errors: string[] = [];

  (Object.entries(links) as [SocialPlatform, string | undefined][]).forEach(([platform, value]) => {
    if (value) {
      errors.push(...validateSocialMedia(
        value,
        platform,
        `${fieldName} ${platform}`
      ));
    }
  });

  return errors;
}; 