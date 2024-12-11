import type { IUser } from './index';

// Type cho đăng ký
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Type cho đăng nhập
export interface LoginDTO {
  email: string;
  password: string;
}

// Type cho response auth
export interface AuthResponse {
  user: IUser;
  token: string;
}

// Type cho session
export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: 'user' | 'admin';
  };
  expires: string;
} 