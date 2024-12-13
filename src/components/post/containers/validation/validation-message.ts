import type { ValidationMessage, ValidationContext } from '../validation-patterns/interfaces/validation-types';

export const createValidationMessage = (
  message: string,
  context: ValidationContext
): ValidationMessage => ({
  message,
  severity: context.options?.severity || 'error',
  field: context.field
});

export const combineValidationMessages = (
  messages: ValidationMessage[],
  context?: ValidationContext
): ValidationMessage[] => {
  if (!context) return messages;
  return messages.map(msg => ({
    ...msg,
    field: context.field
  }));
}; 