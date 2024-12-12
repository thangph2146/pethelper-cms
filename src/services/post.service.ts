import axiosInstance from '@/utils/axiosInstance';
import type { IPost } from '@backend/models/Post';
import type { IComment } from '@backend/models/Comment';
import type { PostsResponse, GetPostsParams, CreatePostData, ApiResponse } from '@/types/api';

export const PostService = {
  getAllPosts: async (page = 1, params: GetPostsParams = {}): Promise<PostsResponse> => {
    const response = await axiosInstance.get<PostsResponse>('/api/posts', { 
      params: { 
        page, 
        ...params 
      } 
    });
    return response.data;
  },

  getPostById: async (id: string): Promise<IPost> => {
    const response = await axiosInstance.get<ApiResponse<IPost>>(`/api/posts/${id}`);
    return response.data.data;
  },

  createPost: async (postData: CreatePostData): Promise<IPost> => {
    const response = await axiosInstance.post<ApiResponse<IPost>>('/api/posts', postData);
    return response.data.data;
  },

  updatePost: async (id: string, postData: Partial<CreatePostData>): Promise<IPost> => {
    const response = await axiosInstance.put<ApiResponse<IPost>>(`/api/posts/${id}`, postData);
    return response.data.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/posts/${id}`);
  },

  likePost: async (id: string): Promise<void> => {
    await axiosInstance.post(`/api/posts/${id}/like`);
  },

  unlikePost: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/posts/${id}/like`);
  },

  savePost: async (id: string): Promise<void> => {
    await axiosInstance.post(`/api/posts/${id}/save`);
  },

  unsavePost: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/posts/${id}/save`);
  },

  addComment: async (postId: string, content: string): Promise<IComment> => {
    const response = await axiosInstance.post<ApiResponse<IComment>>(`/api/posts/${postId}/comments`, { content });
    return response.data.data;
  }
}; 