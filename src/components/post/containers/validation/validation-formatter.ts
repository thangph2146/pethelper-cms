import type { ValidationMessage, ValidationSeverity } from './types/validation-interfaces';
import type { ValidationCode } from './validation-codes';

interface FormatOptions {
  capitalize?: boolean;
  prefix?: string;
  suffix?: string;
  severity?: ValidationSeverity;
}

export class ValidationFormatter {
  private messages: ValidationMessage[] = [];
  private options: FormatOptions = {};

  withMessages(messages: ValidationMessage[]): this {
    this.messages = messages;
    return this;
  }

  withOptions(options: FormatOptions): this {
    this.options = { ...this.options, ...options };
    return this;
  }

  private formatMessage(message: string): string {
    const { capitalize, prefix, suffix } = this.options;
    let formatted = message;

    if (capitalize) {
      formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    if (prefix) {
      formatted = `${prefix} ${formatted}`;
    }

    if (suffix) {
      formatted = `${formatted} ${suffix}`;
    }

    return formatted;
  }

  private filterBySeverity(severity?: ValidationSeverity): ValidationMessage[] {
    if (!severity) return this.messages;
    return this.messages.filter(msg => msg.severity === severity);
  }

  getFirstMessage(): string | undefined {
    const filtered = this.filterBySeverity(this.options.severity);
    const message = filtered[0]?.message;
    return message ? this.formatMessage(message) : undefined;
  }

  getAllMessages(): string[] {
    const filtered = this.filterBySeverity(this.options.severity);
    return filtered.map(msg => this.formatMessage(msg.message));
  }

  getMessagesByCode(code: ValidationCode): string[] {
    const filtered = this.messages.filter(msg => msg.code === code);
    return filtered.map(msg => this.formatMessage(msg.message));
  }

  getMessagesByField(field: string): string[] {
    const filtered = this.messages.filter(msg => msg.field === field);
    return filtered.map(msg => this.formatMessage(msg.message));
  }
}

export const createFormatter = (): ValidationFormatter => {
  return new ValidationFormatter();
}; 