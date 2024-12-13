import type { ValidationMessage } from '../validation-patterns/interfaces/validation-types';

export const createValidationMessages = (errors: string[]): ValidationMessage[] => {
  return errors.map(error => ({
    message: error,
    severity: 'error'
  }));
};

export const combineValidationMessages = (
  messages: ValidationMessage[],
  field?: string
): ValidationMessage[] => {
  if (!field) return messages;
  return messages.map(msg => ({
    ...msg,
    field
  }));
}; 