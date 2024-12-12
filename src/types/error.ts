import type { AuthError } from '@supabase/supabase-js';

interface ErrorDetails {
  [key: string]: string | ErrorDetails;
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly status: number = 400
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(
    message: string = 'Unauthorized',
    public readonly status: number = 401
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(
    message: string = 'Forbidden',
    public readonly status: number = 403
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class SupabaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details: ErrorDetails | null = null,
    public readonly status: number = 500
  ) {
    super(message);
    this.name = 'SupabaseError';
  }

  static fromAuthError(error: AuthError): SupabaseError {
    return new SupabaseError(
      error.message,
      error.name,
      null,
      401
    );
  }
}

export interface AppError extends Error {
  code?: string;
  details?: unknown;
}

export type ErrorHandler = (error: unknown) => void;

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export interface FormError {
  field: string;
  message: string;
}

export type ErrorResponse = {
  error: ApiError | FormError[];
}; 