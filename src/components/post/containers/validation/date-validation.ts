import { VALIDATION_ERRORS } from '../validation-errors';

interface DateValidationOptions {
  minDate?: Date;
  maxDate?: Date;
  format?: string;
}

export const validateDate = (
  value: string | Date,
  fieldName: string,
  options?: DateValidationOptions
): string[] => {
  const errors: string[] = [];
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    errors.push(VALIDATION_ERRORS.field.invalidDate(fieldName));
    return errors;
  }

  if (options?.minDate && date < options.minDate) {
    errors.push(VALIDATION_ERRORS.field.minDate(fieldName, options.minDate));
  }

  if (options?.maxDate && date > options.maxDate) {
    errors.push(VALIDATION_ERRORS.field.maxDate(fieldName, options.maxDate));
  }

  return errors;
}; 