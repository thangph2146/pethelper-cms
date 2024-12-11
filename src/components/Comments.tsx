'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@/utils/axiosInstance';
import { LoadingSpinner } from './LoadingSpinner';
import { formatDate } from '@/utils/format';
import type { IComment } from '@/types/comment';

interface Props {
  postId: string;
  userId: string;
}

export function Comments({ postId, userId }: Props) {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await postApi.getComments(postId);
      return response.data.data;
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await postApi.addComment(postId, content);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setContent('');
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await postApi.deleteComment(postId, commentId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addCommentMutation.mutate(content);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Bình luận</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="w-full border rounded-lg p-3 min-h-[100px]"
          required
        />
        <button
          type="submit"
          disabled={addCommentMutation.isPending}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {addCommentMutation.isPending ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </form>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              {comment.user._id === userId && (
                <button
                  onClick={() => deleteCommentMutation.mutate(comment._id)}
                  disabled={deleteCommentMutation.isPending}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Xóa
                </button>
              )}
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 