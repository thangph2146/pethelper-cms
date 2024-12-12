import type { User } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

export interface SessionResponse {
  session: {
    user: User;
    access_token: string;
    refresh_token: string;
  } | null;
  error: AuthError | null;
} 