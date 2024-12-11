export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  location?: string;
  blocked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  users: IUser[];
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