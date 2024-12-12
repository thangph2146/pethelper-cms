import { ApiResponse } from '@/types/common';
import axiosInstance from '@/utils/axiosInstance';
import type { IComment } from '@backend/models/Comment';

export const CommentService = {
  getComments: async (postId: string): Promise<IComment[]> => {
    const response = await axiosInstance.get<ApiResponse<IComment[]>>(`/posts/${postId}/comments`);
    return response.data.data as IComment[];
  },
  addComment: async (postId: string, content: string): Promise<IComment> => {
    const response = await axiosInstance.post<ApiResponse<IComment>>(`/posts/${postId}/comments`, { content });
    return response.data.data as IComment;
  },

  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
  },

  updateComment: async (postId: string, commentId: string, content: string): Promise<IComment> => {
    const response = await axiosInstance.put<ApiResponse<IComment>>(`/posts/${postId}/comments/${commentId}`, { content });
    return response.data.data as IComment;
  },
  likeComment: async (postId: string, commentId: string): Promise<void> => {
    await axiosInstance.post(`/posts/${postId}/comments/${commentId}/like`);
  },
  unlikeComment: async (postId: string, commentId: string): Promise<void> => {
    await axiosInstance.delete(`/posts/${postId}/comments/${commentId}/like`);
  },
}; 
