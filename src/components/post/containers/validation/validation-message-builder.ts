import type { ValidationCode } from './validation-codes';
import type { ValidationMessageParams } from './types/validation-interfaces';
import { getMessageFromTemplate } from './validation-templates';
import { createFormatter } from './validation-formatter';

export class ValidationMessageBuilder {
  private field: string;
  private code!: ValidationCode;
  private params?: ValidationMessageParams;
  private prefix?: string;
  private suffix?: string;

  constructor(field: string) {
    this.field = field;
  }

  withCode(code: ValidationCode): this {
    this.code = code;
    return this;
  }

  withParams(params: ValidationMessageParams): this {
    this.params = params;
    return this;
  }

  withPrefix(prefix: string): this {
    this.prefix = prefix;
    return this;
  }

  withSuffix(suffix: string): this {
    this.suffix = suffix;
    return this;
  }

  build(): string {
    if (!this.code) {
      throw new Error('Validation code is required');
    }

    const message = getMessageFromTemplate(this.code, {
      field: this.field,
      value: this.params,
      min: typeof this.params === 'number' ? this.params : undefined,
      max: typeof this.params === 'number' ? this.params : undefined,
      index: typeof this.params === 'number' ? this.params : undefined,
      date: typeof this.params === 'string' ? this.params : undefined
    });

    return createFormatter()
      .withMessages([{
        message,
        severity: 'error',
        field: this.field,
        code: this.code
      }])
      .withOptions({
        prefix: this.prefix,
        suffix: this.suffix
      })
      .getFirstMessage() || message;
  }
}

export const createValidationMessage = (field: string): ValidationMessageBuilder => {
  return new ValidationMessageBuilder(field);
}; 