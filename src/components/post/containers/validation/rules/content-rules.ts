import { VALIDATION_DEFAULTS } from '../../validation-patterns';
import { validateRequired, validateLength } from '../field-validation';
import { validateArrayLength } from '../value-validation';
import { createValidationMessages } from '../validation-message-utils';
import type { ValidationResult } from '../../validation-patterns/interfaces/validation-types';

export const validateDescription = (description: string): ValidationResult<string> => {
  const { min, max } = VALIDATION_DEFAULTS.length.content;
  const lengthErrors = validateLength(description, 'Mô tả', min, max);

  return {
    isValid: lengthErrors.length === 0,
    messages: createValidationMessages(lengthErrors),
    data: description
  };
};

export const validateTags = (tags: string[]): ValidationResult<string[]> => {
  const { max } = VALIDATION_DEFAULTS.array.tags;
  const errors = validateArrayLength(tags, 'Tags', max);

  return {
    isValid: errors.length === 0,
    messages: createValidationMessages(errors),
    data: tags
  };
};

export const validateLocation = (location: string): ValidationResult<string> => {
  const required = validateRequired(location, 'Địa điểm');
  if (!required.isValid) return required;

  return {
    isValid: true,
    messages: [],
    data: location
  };
}; 