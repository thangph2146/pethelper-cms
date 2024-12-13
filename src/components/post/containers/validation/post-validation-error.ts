import { ValidationError } from './validation-error';
import type { ValidationMessage } from './types/validation-interfaces';
import type { ValidationCode } from './validation-codes';
import { logger } from '@/services/log-service';

export class PostValidationError extends ValidationError {
  readonly component: string;
  readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ValidationCode,
    field: string,
    messages: ValidationMessage[] = [],
    path?: string[],
    context?: Record<string, unknown>
  ) {
    super(message, code, field, messages, path);
    this.name = 'PostValidationError';
    this.component = 'PostCard';
    this.context = context;
  }

  static fromValidationError(
    error: ValidationError,
    context?: Record<string, unknown>
  ): PostValidationError {
    return new PostValidationError(
      error.message,
      error.code,
      error.field,
      error.messages,
      error.path,
      context
    );
  }

  logError(): void {
    logger.error({
      message: this.message,
      error: this,
      data: {
        code: this.code,
        field: this.field,
        messages: this.messages,
        path: this.path,
        context: this.context
      },
      component: this.component
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      component: this.component,
      context: this.context
    };
  }
}

export const isPostValidationError = (error: unknown): error is PostValidationError => {
  return error instanceof PostValidationError;
}; 