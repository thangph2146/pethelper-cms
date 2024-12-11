import axios from 'axios';
import type { IPost, CreatePostInput, UpdatePostInput } from '@/types/post';
import type { IComment } from '@/types/comment';
import type { ApiResponse, PostsResponse, PostFilters } from '@/types/api';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Nếu không có response hoặc lỗi network
    if (!error.response || error.code === 'ERR_NETWORK') {
      return Promise.reject(error);
    }

    // Nếu lỗi 403 hoặc 401
    if (error.response.status === 403 || error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

export const postApi = {
  getAll: (params?: PostFilters) => 
    axiosInstance.get<ApiResponse<PostsResponse>>('/posts', { params }),
    
  getOne: (id: string) => 
    axiosInstance.get<ApiResponse<IPost>>(`/posts/${id}`),
    
  create: (data: CreatePostInput) => 
    axiosInstance.post<ApiResponse<IPost>>('/posts', data),
    
  update: (id: string, data: UpdatePostInput) => 
    axiosInstance.put<ApiResponse<IPost>>(`/posts/${id}`, data),
    
  uploadImages: (postId: string, images: FormData) =>
    axiosInstance.post<ApiResponse<string[]>>(`/posts/${postId}/images`, images, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
  delete: (id: string) => 
    axiosInstance.delete<ApiResponse<void>>(`/posts/${id}`),
    
  addComment: (id: string, content: string) => 
    axiosInstance.post<ApiResponse<IPost>>(`/posts/${id}/comments`, { content }),
    
  toggleLike: (id: string) => 
    axiosInstance.post<ApiResponse<IPost>>(`/posts/${id}/like`),
    
  getComments: (postId: string) => 
    axiosInstance.get<ApiResponse<IComment[]>>(`/posts/${postId}/comments`),
    
  addCommentToPost: (postId: string, content: string) => 
    axiosInstance.post<ApiResponse<IComment[]>>(`/posts/${postId}/comments`, { content }),
    
  deleteComment: (postId: string, commentId: string) => 
    axiosInstance.delete<ApiResponse<void>>(`/posts/${postId}/comments/${commentId}`)
};

export default axiosInstance; 