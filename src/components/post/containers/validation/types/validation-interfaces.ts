import type { ValidationCode } from '../validation-codes';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export type ValidationMessageParams = string | number;

export interface ValidationMessage {
  message: string;
  severity: ValidationSeverity;
  field: string;
  path?: string[];
  code: ValidationCode;
}

export interface ValidationOptions {
  trim?: boolean;
  required?: boolean;
  severity?: ValidationSeverity;
  customMessages?: {
    required?: string;
    pattern?: string;
    min?: string;
    max?: string;
  };
}

export interface ValidationContext {
  field: string;
  path?: string[];
  parent?: string;
  severity?: ValidationSeverity;
  options?: ValidationOptions;
}

export interface ValidationResult<T> {
  isValid: boolean;
  messages: ValidationMessage[];
  data: T;
  context?: ValidationContext;
}

export interface ValidationRule<T> {
  validate: (value: T, context: ValidationContext) => ValidationResult<T>;
  options?: ValidationOptions;
} 