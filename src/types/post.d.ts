import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
}

export interface IComment {
  _id: Types.ObjectId;
  user: IUser;
  content: string;
  createdAt: Date;
}

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  description: string;
  type: 'dog' | 'cat' | 'other';
  location: string;
  status: 'cần_giúp_đỡ' | 'đang_hỗ_trợ' | 'đã_giải_quyết';
  urgency: 'cao' | 'trung_bình' | 'thấp';
  images: string[];
  author: IUser;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchPostParams {
  keyword?: string;
  type?: 'dog' | 'cat' | 'other';
  status?: 'cần_giúp_đỡ' | 'đang_hỗ_trợ' | 'đã_giải_quyết';
  urgency?: 'cao' | 'trung_bình' | 'thấp';
  sort?: 'createdAt_desc' | 'createdAt_asc' | 'urgency_desc' | 'urgency_asc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}

export interface InfinitePostsResponse {
  pages: PaginatedResponse<IPost[]>[];
  pageParams: number[];
}