'use client';

import React from 'react';
import { usePosts } from '@/hooks/use-posts';
import { PostCard } from './PostCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import type { PostFilters } from '@/types/api';

interface Props {
  filters?: Omit<PostFilters, 'page' | 'limit'>;
  limit?: number;
  showPagination?: boolean;
}

export function PostList({ filters, limit, showPagination = false }: Props) {
  const { posts, pagination, loading, error } = usePosts({
    ...filters,
    limit,
    page: 1
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Không thể tải danh sách bài đăng" />;
  if (!posts.length) return <div className="text-center py-8">Không có bài đăng nào</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {showPagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          {/* Thêm component Pagination ở đây */}
        </div>
      )}
    </div>
  );
} 