import { VALIDATION_PATTERNS } from '../validation-patterns';
import { VALIDATION_ERRORS } from '../validation-errors';
import type { ValidationResult } from '../validation-patterns/interfaces/validation-types';
import { createValidationResult } from './validation-result';
import { validateSocialMedia } from './social-validation';

export const validateEmail = (
  value: string,
  fieldName: string
): string[] => {
  if (!value) return [];
  
  if (!VALIDATION_PATTERNS.email.test(value)) {
    return [VALIDATION_ERRORS.field.invalidEmail(fieldName)];
  }
  return [];
};

export const validatePhone = (
  value: string,
  fieldName: string,
  countryCode: 'vietnam' | 'international' = 'vietnam'
): string[] => {
  if (!value) return [];

  const pattern = countryCode === 'international'
    ? VALIDATION_PATTERNS.phone.international
    : VALIDATION_PATTERNS.phone.vietnam;

  if (!pattern.test(value)) {
    return [VALIDATION_ERRORS.field.invalidPhone(fieldName)];
  }
  return [];
};

interface ContactInfo {
  phone?: string;
  email?: string;
  facebook?: string;
}

export const validateContactInfo = (
  value: ContactInfo,
  fieldName: string
): ValidationResult<ContactInfo> => {
  const errors = [
    ...validatePhone(value.phone || '', 'Số điện thoại'),
    ...validateEmail(value.email || '', 'Email'),
    ...validateSocialMedia(value.facebook || '', 'facebook', 'Facebook')
  ];

  return createValidationResult(value, errors);
}; 