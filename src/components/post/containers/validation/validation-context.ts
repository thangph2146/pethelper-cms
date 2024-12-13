import type { 
  ValidationMessage, 
  ValidationResult, 
  ValidationContext,
  ValidationSeverity,
  ValidationOptions 
} from './types/validation-interfaces';
import type { ValidationCode } from './validation-codes';
import { getValidationMessage } from './validation-messages';
import { ValidationError } from './validation-error';

export class ValidationBuilder<T> {
  private context: ValidationContext;
  private messages: ValidationMessage[] = [];
  private data: T;

  constructor(data: T, context: ValidationContext) {
    this.data = data;
    this.context = context;
  }

  addMessage(message: string | ValidationCode, options: {
    severity?: ValidationSeverity;
    code: ValidationCode;
    params?: any;
  }): this {
    const finalMessage = typeof message === 'string' 
      ? message
      : getValidationMessage(message, this.context.field, options.params);

    this.messages.push({
      message: finalMessage,
      severity: options.severity || this.context.severity || 'error',
      field: this.context.field,
      path: this.context.path,
      code: options.code
    });
    return this;
  }

  addError(message: string, code: ValidationCode): this {
    return this.addMessage(message, { severity: 'error', code });
  }

  addWarning(message: string, code: ValidationCode): this {
    return this.addMessage(message, { severity: 'warning', code });
  }

  addInfo(message: string, code: ValidationCode): this {
    return this.addMessage(message, { severity: 'info', code });
  }

  build(): ValidationResult<T> {
    if (!this.code) {
      throw new Error('Validation code is required');
    }

    const result = {
      isValid: !this.messages.some(m => m.severity === 'error'),
      messages: this.messages,
      data: this.data,
      context: this.context
    };

    if (!result.isValid) {
      throw ValidationError.fromMessages(this.messages);
    }

    return result;
  }

  buildSafe(): ValidationResult<T> {
    try {
      return this.build();
    } catch (error) {
      if (isValidationError(error)) {
        return {
          isValid: false,
          messages: error.messages,
          data: this.data,
          context: this.context
        };
      }
      throw error;
    }
  }
}

export const createValidationContext = (
  field: string,
  options?: Partial<ValidationContext & ValidationOptions>
): ValidationContext => ({
  field,
  path: options?.path || [field],
  parent: options?.parent,
  severity: options?.severity || 'error',
  options: {
    trim: options?.trim,
    required: options?.required,
    severity: options?.severity,
    customMessages: options?.customMessages
  }
});

export const createValidation = <T>(
  data: T,
  context: ValidationContext
): ValidationBuilder<T> => {
  return new ValidationBuilder(data, context);
}; 