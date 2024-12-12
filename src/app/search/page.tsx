'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfinitePosts } from '@/hooks/use-infinite-posts';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { IPost, PostFilters } from '@/types/post';
import { 
  POST_TYPE_LABELS, 
  POST_STATUS_LABELS, 
  POST_URGENCY_LABELS,
  PostType,
  PostStatus,
  PostUrgency 
} from '@/types/post';

// Chuyển các options thành array từ constants
const TYPE_OPTIONS = Object.entries(POST_TYPE_LABELS).map(([value, label]) => ({
  value,
  label
}));

const STATUS_OPTIONS = Object.entries(POST_STATUS_LABELS).map(([value, label]) => ({
  value,
  label
}));

const URGENCY_OPTIONS = Object.entries(POST_URGENCY_LABELS).map(([value, label]) => ({
  value,
  label
}));

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const getInitialFilters = useCallback(() => {
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    
    return {
      keyword: searchParams.get('q') || '',
      type: type && type !== 'all' ? type as PostType : undefined,
      status: status && status !== 'all' ? status as PostStatus : undefined,
      urgency: urgency && urgency !== 'all' ? urgency as PostUrgency : undefined,
      limit: 12,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<PostFilters>(getInitialFilters());

  // Cập nhật URL khi filters thay đổi
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.keyword) params.set('q', filters.keyword);
    if (filters.type) params.set('type', filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.urgency) params.set('urgency', filters.urgency);
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  }, [filters, router]);

  // Reset filters
  const handleReset = () => {
    setFilters({
      keyword: '',
      limit: 12
    });
  };

  // Xử lý thay đổi filter
  const handleFilterChange = <T extends keyof PostFilters>(
    key: T,
    value: string
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value as PostFilters[T]
    }));
  };

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfinitePosts({ filters, limit: filters.limit || 12 });

  const allPosts = data?.pages.flatMap(page => page.data) || [];

  // Thêm function xử lý search form
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const keyword = formData.get('keyword') as string;
    
    setFilters(prev => ({
      ...prev,
      keyword: keyword.trim()
    }));
  };

  // Thêm loading state cho infinite scroll
  const isLoadingMore = isLoading || isFetchingNextPage;

  // Thêm hàm chuyển đổi dữ liệu
  const transformPostForCard = (post: IPost) => ({
    id: post._id,
    title: post.title,
    content: post.content,
    user_id: post.author._id,
    status: post.status,
    created_at: post.createdAt,
    updated_at: post.updatedAt
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Form */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <input
            type="text"
            name="keyword"
            placeholder="Tìm kiếm..."
            defaultValue={filters.keyword}
            className="flex-1 p-2 border rounded-lg dark:bg-gray-800"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.type || 'all'}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="p-2 border rounded-lg dark:bg-gray-800"
          >
            {TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="p-2 border rounded-lg dark:bg-gray-800"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.urgency || 'all'}
            onChange={(e) => handleFilterChange('urgency', e.target.value)}
            className="p-2 border rounded-lg dark:bg-gray-800"
          >
            {URGENCY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={handleReset}
          disabled={isLoadingMore}
          className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Đặt lại bộ lọc
        </button>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner />
      ) : allPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {filters.keyword 
              ? `Không tìm thấy kết quả cho "${filters.keyword}"`
              : 'Không tìm thấy bài đăng nào'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post) => (
              <PostCard 
                key={post._id.toString()} 
                post={transformPostForCard(post)}
              />
            ))}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="mt-8 text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isLoadingMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 