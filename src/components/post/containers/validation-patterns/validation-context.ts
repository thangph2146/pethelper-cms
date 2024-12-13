import type { ValidationContext, ValidationOptions, ValidationMessage } from './interfaces/validation-types';

export class ValidationContextBuilder {
  private context: ValidationContext;

  constructor(field: string) {
    this.context = {
      field,
      options: {},
      messages: []
    };
  }

  withOptions(options: ValidationOptions): this {
    this.context.options = {
      ...this.context.options,
      ...options
    };
    return this;
  }

  withMessages(messages: ValidationMessage[]): this {
    this.context.messages = [
      ...this.context.messages || [],
      ...messages
    ];
    return this;
  }

  withSeverity(severity: ValidationOptions['severity']): this {
    this.context.options = {
      ...this.context.options,
      severity
    };
    return this;
  }

  withCustomMessages(messages: ValidationOptions['customMessages']): this {
    this.context.options = {
      ...this.context.options,
      customMessages: {
        ...this.context.options?.customMessages,
        ...messages
      }
    };
    return this;
  }

  build(): ValidationContext {
    return this.context;
  }
}

export const createValidationContext = (field: string): ValidationContextBuilder => {
  return new ValidationContextBuilder(field);
}; 