export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'blocked';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  phone?: string | null;
  address?: string | null;
  role: string;
  status: string;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  users: SafeUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminStats {
  posts: {
    total: number;
    needHelp: number;
    beingHelped: number;
    helped: number;
  };
  users: {
    total: number;
    active: number;
  };
  reports: {
    total: number;
    pending: number;
  };
} 