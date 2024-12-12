import type { SafeUser } from './user';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export type CreateUserResponse = SafeUser;

export interface AuthResponse {
  success: boolean;
  message: string;
  user: CreateUserResponse;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: SafeUser;
  token: string;
} 