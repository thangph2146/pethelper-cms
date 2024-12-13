export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationMessage {
  message: string;
  severity: ValidationSeverity;
  field?: string;
}

export interface ValidationResult<T> {
  isValid: boolean;
  messages: ValidationMessage[];
  data: T;
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
  options?: ValidationOptions;
  messages?: ValidationMessage[];
} 