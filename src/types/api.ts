import type { ApiResponse } from './common';

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiSuccessResponse<T> extends ApiResponse {
  success: true;
  data: T;
  message?: string;
}

export interface ApiHandler<T = void> {
  (req: Request): Promise<Response>;
  response: ApiSuccessResponse<T>;
}

export interface ErrorDetails {
  [key: string]: string | ErrorDetails;
}

export interface ApiError extends Error {
  code?: string;
  response?: {
    status: number;
    data?: {
      message: string;
    };
  };
} 