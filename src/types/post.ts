import type { IUser } from './user';
import type { IComment } from './comment';

export interface IPost {
  _id: string;
  title: string;
  content: string;
  category: 'dog' | 'cat' | 'other';
  status: 'need-help' | 'being-helped' | 'helped';
  urgency: 'high' | 'medium' | 'low';
  location: string;
  description: string;
  contactInfo: string;
  images: string[];
  author: {
    _id: string;
    name: string;
    email: string;
  };
  contact: {
    phone: string;
    email?: string;
  };
  likes: string[];
  comments: {
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export type CreatePostInput = Omit<IPost, '_id' | 'author' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>;
export type UpdatePostInput = Partial<CreatePostInput>;

export interface PostResponse {
  posts: IPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 