import type { ValidationResult, ValidationMessage, ValidationContext } from '../validation-patterns/interfaces/validation-types';
import { combineValidationMessages } from './validation-message';

export const createValidationResult = <T>(
  data: T,
  messages: ValidationMessage[] = [],
  context?: ValidationContext
): ValidationResult<T> => ({
  isValid: messages.length === 0,
  messages: combineValidationMessages(messages, context),
  data
});

export const combineValidationResults = <T extends object>(
  results: Array<ValidationResult<any>>,
  combineData: (data: any[]) => T
): ValidationResult<T> => {
  const messages = results.flatMap(result => result.messages);
  const isValid = results.every(result => result.isValid);
  const data = combineData(results.map(result => result.data));

  return createValidationResult(data, messages);
}; 