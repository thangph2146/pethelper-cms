import { AxiosResponse } from 'axios';
import type { IPost, PostResponse, PostsResponse } from './post';

declare module 'axios' {
  export interface AxiosResponse<T = any> {
    data: T;
  }

  export interface AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<T>;
    get<T = PostsResponse>(url: '/posts', config?: any): Promise<T>;
    get<T = PostResponse>(url: `/posts/${string}`, config?: any): Promise<T>;
    get<T = PostsResponse>(url: `/users/${string}/posts`, config?: any): Promise<T>;

    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
    post<T = PostResponse>(url: '/posts', data?: any, config?: any): Promise<T>;
    post<T = PostResponse>(url: `/posts/${string}/comments`, data?: any, config?: any): Promise<T>;

    put<T = any>(url: string, data?: any, config?: any): Promise<T>;
    put<T = PostResponse>(url: `/posts/${string}`, data?: any, config?: any): Promise<T>;

    delete<T = any>(url: string, config?: any): Promise<T>;
    delete<T = { message: string }>(url: `/posts/${string}`, config?: any): Promise<T>;
  }
} 