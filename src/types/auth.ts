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