'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useComments, useAddComment, useDeleteComment } from '@/hooks/use-comments';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface CommentListProps {
  id: string;
}

export default function CommentList({ id }: CommentListProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  
  const { data: commentsData, isLoading, error } = useComments(id);
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await addComment.mutateAsync({ id, content });
      setContent('');
    } catch (error) {
      console.error('Add comment error:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;

    try {
      await deleteComment.mutateAsync({ id, commentId });
    } catch (error) {
      console.error('Delete comment error:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Không thể tải bình luận" />;
  if (!commentsData?.data.length) return <p className="text-gray-500">Chưa có bình luận nào</p>;

  return (
    <div className="space-y-6">
      {/* Form thêm bình luận */}
      {session && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận..."
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            type="submit"
            disabled={addComment.isPending || !content.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {addComment.isPending ? 'Đang gửi...' : 'Gửi bình luận'}
          </button>
        </form>
      )}

      {/* Danh sách bình luận */}
      <div className="space-y-4">
        {commentsData.data.map((comment) => (
          <div key={comment._id.toString()} className="flex gap-4">
            <Image
              src={comment.user.image || '/images/default-avatar.png'}
              alt={comment.user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{comment.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {(session?.user?.id === comment.user._id.toString() || 
                    session?.user?.role === 'admin') && (
                    <button
                      onClick={() => handleDelete(comment._id.toString())}
                      disabled={deleteComment.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                <p className="mt-2">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 