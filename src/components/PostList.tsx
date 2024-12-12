'use client';

import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { PostCard } from '@/components/PostCard';
import { useSupabase } from '@/hooks/use-supabase';
import type { PostRow } from '@/types/supabase';

export function PostList() {
  const { fetchPosts } = useSupabase();

  const { data: posts, isLoading, error } = useQuery<PostRow[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 // 1 phút
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Đã có lỗi xảy ra khi tải danh sách bài đăng
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chưa có bài đăng nào
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
} 