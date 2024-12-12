import { User } from "@supabase/supabase-js";

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
  };
  token: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: SafeUser;
}

// Loại bỏ các thông tin nhạy cảm của User
export type SafeUser = Omit<
  User,
  'password' | 'loginAttempts' | 'lockUntil'
>;

// Type cho session
export interface SessionData {
  token: string;
  deviceInfo?: string;
  expiresAt: Date;
}

export interface ValidateSessionResponse {
  status: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
  }
}

// Type cho user trong request
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  }
} 