import type { ValidationRule, ValidationContext, ValidationResult } from './types/validation-interfaces';
import { createValidation } from './validation-context';

export const createRequiredRule = <T>(
  message?: string
): ValidationRule<T> => ({
  validate: (value: T, context: ValidationContext): ValidationResult<T> => {
    const validation = createValidation(value, context);
    
    if (value == null || value === '') {
      validation.addError(
        message || `${context.field} là bắt buộc`,
        'REQUIRED'
      );
    }

    return validation.build();
  }
});

export const createLengthRule = (
  min?: number,
  max?: number
): ValidationRule<string> => ({
  validate: (value: string, context: ValidationContext): ValidationResult<string> => {
    const validation = createValidation(value, context);
    
    if (min != null && value.length < min) {
      validation.addError(
        `${context.field} phải có ít nhất ${min} ký tự`,
        'MIN_LENGTH'
      );
    }

    if (max != null && value.length > max) {
      validation.addError(
        `${context.field} không được vượt quá ${max} ký tự`,
        'MAX_LENGTH'
      );
    }

    return validation.build();
  }
});

export const createPatternRule = (
  pattern: RegExp,
  message: string
): ValidationRule<string> => ({
  validate: (value: string, context: ValidationContext): ValidationResult<string> => {
    const validation = createValidation(value, context);

    if (!pattern.test(value)) {
      validation.addError(message, 'PATTERN');
    }

    return validation.build();
  }
});

export const createCompositeRule = <T>(
  rules: ValidationRule<T>[]
): ValidationRule<T> => ({
  validate: (value: T, context: ValidationContext): ValidationResult<T> => {
    const validation = createValidation(value, context);
    
    for (const rule of rules) {
      const result = rule.validate(value, context);
      if (!result.isValid) {
        result.messages.forEach(msg => 
          validation.addMessage(msg.message, msg)
        );
      }
    }

    return validation.build();
  }
}); 