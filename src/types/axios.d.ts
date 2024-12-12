import type { AxiosRequestConfig } from 'axios';
import type { Database } from './supabase';

type Tables = Database['public']['Tables'];
type TableNames = keyof Tables;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    details?: Record<string, string>;
  };
}

interface RequestConfig<T = unknown> extends AxiosRequestConfig {
  data?: T;
  params?: Record<string, string | number | boolean>;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

interface QueryParams extends PaginationParams, FilterParams {}

declare module 'axios' {
  export interface AxiosInstance {
    request<T = unknown>(config: RequestConfig<T>): Promise<ApiResponse<T>>;
    get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
    delete<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
    head<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
    options<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
    post<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<ApiResponse<T>>;
    put<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<ApiResponse<T>>;
    patch<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<ApiResponse<T>>;
  }
} 