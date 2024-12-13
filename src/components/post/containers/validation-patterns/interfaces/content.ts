import type { ValidationRule } from './base';

export interface ContentValidation {
  title: ValidationRule;
  body: ValidationRule;
  comment: ValidationRule;
  excerpt: ValidationRule;
}

export interface UserValidation {
  name: ValidationRule;
  password: ValidationRule & {
    strength: {
      minLength: number;
      requireNumbers: boolean;
      requireSymbols: boolean;
      requireUppercase: boolean;
    };
  };
  bio: ValidationRule;
} 