import { VALIDATION_DEFAULTS } from '../../validation-patterns';
import { validateNumber } from '../value-validation';
import { createValidationMessages } from '../validation-message-utils';
import type { ValidationResult } from '../../validation-patterns/interfaces/validation-types';

export const validateLikes = (count: number): ValidationResult<number> => {
  const errors = validateNumber(count, 'Lượt thích', 0, VALIDATION_DEFAULTS.value.likes.max);
  return {
    isValid: errors.length === 0,
    messages: createValidationMessages(errors),
    data: count
  };
};

export const validateComments = (count: number): ValidationResult<number> => {
  const errors = validateNumber(count, 'Bình luận', 0, VALIDATION_DEFAULTS.value.comments.max);
  return {
    isValid: errors.length === 0,
    messages: createValidationMessages(errors),
    data: count
  };
};

export const validateSaves = (count: number): ValidationResult<number> => {
  const errors = validateNumber(count, 'Lưu', 0, VALIDATION_DEFAULTS.value.saves.max);
  return {
    isValid: errors.length === 0,
    messages: createValidationMessages(errors),
    data: count
  };
}; 