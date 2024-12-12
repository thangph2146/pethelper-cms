import { ApiResponse } from '@/types/post';
import axiosInstance from '@/utils/axiosInstance';
import type { IComment } from '@backend/models/Comment';

export const CommentService = {
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
}; 