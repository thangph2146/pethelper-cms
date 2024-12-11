'use client';

import { usePost } from '@/hooks/use-posts';
import { PostForm } from '@/components/PostForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { post, loading, error } = usePost(params.id);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Không thể tải bài đăng" />;
  if (!post) return <ErrorMessage message="Không tìm thấy bài đăng" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Chỉnh sửa bài đăng</h1>
        <PostForm initialData={post} isEditing />
      </div>
    </div>
  );
} 