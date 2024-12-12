import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface ErrorDetails {
  [key: string]: string | ErrorDetails;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: ErrorDetails;
}

interface ErrorHandlerOptions {
  defaultMessage?: string;
  defaultStatus?: number;
}

export function withErrorHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: ErrorHandlerOptions = {}
) {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error: unknown) {
      console.error('API Error:', error);

      const apiError = error as ApiError;
      const status = apiError.status || options.defaultStatus || 500;
      
      return NextResponse.json(
        {
          success: false,
          message: apiError.message || options.defaultMessage || 'Internal Server Error',
          details: apiError.details,
          code: apiError.code
        },
        { status }
      );
    }
  };
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