import type { ValidationRule, ValidationContext, ValidationResult } from '../types/validation-interfaces';
import { createValidation } from '../validation-context';

export const createArrayLengthRule = (
  max: number,
  options?: {
    min?: number;
    message?: string;
  }
): ValidationRule<any[]> => ({
  validate: (value: any[], context: ValidationContext): ValidationResult<any[]> => {
    const validation = createValidation(value, context);
    
    if (options?.min != null && value.length < options.min) {
      validation.addError(
        options.message || `${context.field} phải có ít nhất ${options.min} phần tử`,
        'MIN_ARRAY_LENGTH'
      );
    }

    if (value.length > max) {
      validation.addError(
        options?.message || `${context.field} không được vượt quá ${max} phần tử`,
        'MAX_ARRAY_LENGTH'
      );
    }

    return validation.build();
  }
});

export const createArrayItemsRule = <T>(
  itemRule: ValidationRule<T>
): ValidationRule<T[]> => ({
  validate: (items: T[], context: ValidationContext): ValidationResult<T[]> => {
    const validation = createValidation(items, context);
    
    items.forEach((item, index) => {
      const itemContext = {
        ...context,
        field: `${context.field}[${index}]`,
        path: [...(context.path || []), index.toString()]
      };

      const result = itemRule.validate(item, itemContext);
      if (!result.isValid) {
        result.messages.forEach(msg => validation.addMessage(msg.message, msg));
      }
    });

    return validation.build();
  }
}); 