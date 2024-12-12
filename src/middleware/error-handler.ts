import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: {
    [key: string]: string;
  };
}

export function errorHandler(
  request: NextRequest,
  error: unknown
) {
  console.error('API Error:', error);

  const apiError = error as ApiError;
  const status = apiError.status || 500;
  
  return NextResponse.json(
    {
      success: false,
      message: apiError.message || 'Internal Server Error',
      details: apiError.details,
      code: apiError.code
    },
    { status }
  );
} 