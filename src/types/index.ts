import type { IUser } from '@backend/models/User';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      isAdmin?: boolean;
    };
  }
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
} 