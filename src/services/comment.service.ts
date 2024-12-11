import axiosInstance from '@/lib/axios';
import type { IComment } from '@backend/models/Comment';

export const CommentService = {
  addComment: async (postId: string, content: string): Promise<IComment> => {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, { content });
    return response;
  },

  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
  },

  updateComment: async (postId: string, commentId: string, content: string): Promise<IComment> => {
    const response = await axiosInstance.put(`/posts/${postId}/comments/${commentId}`, { content });
    return response;
  },
}; 