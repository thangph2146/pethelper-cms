import type { ValidationMessage } from './types/validation-interfaces';
import type { ValidationCode } from './validation-codes';

export class ValidationError extends Error {
  readonly code: ValidationCode;
  readonly field: string;
  readonly messages: ValidationMessage[];
  readonly path?: string[];

  constructor(
    message: string,
    code: ValidationCode,
    field: string,
    messages: ValidationMessage[] = [],
    path?: string[]
  ) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.field = field;
    this.messages = messages;
    this.path = path;
  }

  static fromMessage(message: ValidationMessage): ValidationError {
    return new ValidationError(
      message.message,
      message.code,
      message.field,
      [message],
      message.path
    );
  }

  static fromMessages(messages: ValidationMessage[]): ValidationError {
    const firstMessage = messages[0];
    if (!firstMessage) {
      throw new Error('At least one validation message is required');
    }

    return new ValidationError(
      firstMessage.message,
      firstMessage.code,
      firstMessage.field,
      messages,
      firstMessage.path
    );
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      field: this.field,
      messages: this.messages,
      path: this.path
    };
  }
}

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
}; 