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
  session: any;
  user?: any; // Add the user property
  error: {
    message: string;
    code: string;
    details?: {
      message: string;
    };
  } | null;
}
