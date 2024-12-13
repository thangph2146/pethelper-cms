import { VALIDATION_ERRORS } from '../validation-errors';

export const validateNumber = (
  value: number,
  fieldName: string,
  min?: number,
  max?: number
): string[] => {
  const errors: string[] = [];

  if (min != null && value < min) {
    errors.push(VALIDATION_ERRORS.field.minValue(fieldName, min));
  }
  if (max != null && value > max) {
    errors.push(VALIDATION_ERRORS.field.maxValue(fieldName, max));
  }

  return errors;
};

export const validateArrayLength = (
  array: any[],
  fieldName: string,
  max: number
): string[] => {
  if (array.length > max) {
    return [VALIDATION_ERRORS.limit.maxCount(fieldName, max)];
  }
  return [];
};

export const validateEnum = <T extends string>(
  value: string,
  validValues: readonly T[],
  fieldName: string
): string[] => {
  if (!validValues.includes(value as T)) {
    return [VALIDATION_ERRORS.field.invalidValue(fieldName)];
  }
  return [];
};

export const validateBoolean = (
  value: unknown,
  fieldName: string
): boolean => {
  return Boolean(value);
}; 