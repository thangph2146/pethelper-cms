import type { ValidationResult, ValidationOptions } from '../validation-patterns/interfaces/validation-types';
import { VALIDATION_ERRORS } from '../validation-errors';
import { createValidationContext } from '../validation-patterns/validation-context';
import { createValidationMessage } from './validation-message';
import { createValidationResult } from './validation-result';

export const validateRequired = <T>(
  value: T | null | undefined,
  fieldName: string,
  options?: ValidationOptions
): ValidationResult<T> => {
  const context = createValidationContext(fieldName)
    .withOptions(options || {})
    .build();

  if (value == null || value === '') {
    const message = context.options?.customMessages?.required || 
      VALIDATION_ERRORS.field.required(fieldName);

    return createValidationResult(
      value as T,
      [createValidationMessage(message, context)],
      context
    );
  }

  return createValidationResult(value as T, [], context);
};

export const validateLength = (
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): string[] => {
  const errors: string[] = [];

  if (min != null && value.length < min) {
    errors.push(VALIDATION_ERRORS.field.minLength(fieldName, min));
  }
  if (max != null && value.length > max) {
    errors.push(VALIDATION_ERRORS.field.maxLength(fieldName, max));
  }

  return errors;
}; 