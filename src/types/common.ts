import type { Database } from './supabase';

type Tables = Database['public']['Tables'];

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    details?: Record<string, string>;
  };
}

export interface QueryFilters {
  [key: string]: string | number | boolean | undefined;
}

export interface QueryParams extends PaginationParams, QueryFilters {}

export type TableRow<T extends keyof Tables> = Tables[T]['Row'];
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update']; 