import type { IPost } from '@backend/models/Post';
import type { IComment } from '@backend/models/Comment';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface PostsResponse {
  posts: IPost[];
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

export interface GetPostsParams {
  page?: number;
  status?: string;
  animalType?: string;
  search?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  location: string;
  animalType: 'dog' | 'cat' | 'other';
  status: 'need_help' | 'helping' | 'helped';
  images?: string[];
}

export interface CustomAxiosInstance extends AxiosInstance {
  _retry?: boolean;
}

export interface CustomAxiosResponse<T = any> {
  data: T;
  status: number;
  message?: string;
} 