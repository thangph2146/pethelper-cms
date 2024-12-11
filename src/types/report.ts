import type { IUser } from './user';
import type { IPost } from './post';

export interface IReport {
  _id: string;
  post: IPost;
  user: IUser;
  type: 'spam' | 'inappropriate' | 'fake' | 'other';
  reason: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: IUser;
}

export interface ReportResponse {
  reports: IReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 