'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInfinitePosts } from '@/hooks/use-infinite-posts';
import PostCard from '@/components/PostCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { SearchPostParams } from '@/types/post';

const TYPE_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'dog', label: 'Chó' },
  { value: 'cat', label: 'Mèo' },
  { value: 'other', label: 'Khác' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'cần_giúp_đỡ', label: 'Cần giúp đỡ' },
  { value: 'đang_hỗ_trợ', label: 'Đang hỗ trợ' },
  { value: 'đã_giải_quyết', label: 'Đã giải quyết' }
];

const URGENCY_OPTIONS = [
  { value: 'all', label: 'Tất cả mức độ' },
  { value: 'cao', label: 'Khẩn cấp' },
  { value: 'trung_bình', label: 'Trung bình' },
  { value: 'thấp', label: 'Thấp' }
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchPostParams>({
    keyword: searchParams.get('q') || '',
    type: (searchParams.get('type') as SearchPostParams['type']) || undefined,
    status: (searchParams.get('status') as SearchPostParams['status']) || undefined,
    urgency: (searchParams.get('urgency') as SearchPostParams['urgency']) || undefined,
    limit: 12,
  });

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfinitePosts(filters);

  const allPosts = data?.pages.flatMap(page => page.data) || [];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFilters(prev => ({
      ...prev,
      keyword: formData.get('keyword') as string,
    }));
  };

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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.type || 'all'}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              type: e.target.value === 'all' ? undefined : e.target.value as SearchPostParams['type']
            }))}
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
            onChange={(e) => setFilters(prev => ({
              ...prev,
              status: e.target.value === 'all' ? undefined : e.target.value as SearchPostParams['status']
            }))}
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
            onChange={(e) => setFilters(prev => ({
              ...prev,
              urgency: e.target.value === 'all' ? undefined : e.target.value as SearchPostParams['urgency']
            }))}
            className="p-2 border rounded-lg dark:bg-gray-800"
          >
            {URGENCY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner />
      ) : allPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy bài đăng nào</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post) => (
              <PostCard key={post._id.toString()} post={post} />
            ))}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="mt-8 text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
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