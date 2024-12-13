import type { ValidationOptions, ValidationContext } from './validation-types';

export interface ValidationPattern<T> {
  pattern: T;
  message: string;
  context?: ValidationContext;
}

export interface ValidationLimit {
  min?: number;
  max: number;
  message?: string;
  context?: ValidationContext;
}

export interface ContentLimit {
  min: number;
  max: number;
  context?: ValidationContext;
}

export interface ValidationRule {
  required: boolean;
  trim: boolean;
  limit: ContentLimit;
  pattern?: RegExp;
  message?: string;
  options?: ValidationOptions;
  context?: ValidationContext;
} 