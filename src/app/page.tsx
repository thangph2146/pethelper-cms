'use client';

import { usePosts } from '@/hooks/use-posts';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function HomePage() {
  const { posts, loading, error, filters, setFilters } = usePosts();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Danh sách động vật cần cứu trợ</h1>
      
      {/* Bộ lọc */}
      <div className="mb-6 flex gap-4">
        <select
          value={filters.animalType || ''}
          onChange={(e) => setFilters({ ...filters, animalType: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả loại</option>
          <option value="DOG">Chó</option>
          <option value="CAT">Mèo</option>
          <option value="OTHER">Khác</option>
        </select>

        <select
          value={filters.urgency || ''}
          onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả mức độ</option>
          <option value="HIGH">Khẩn cấp</option>
          <option value="MEDIUM">Trung bình</option>
          <option value="LOW">Thấp</option>
        </select>
      </div>

      {/* Danh sách bài đăng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="border rounded-lg p-4 shadow-md">
            {post.images[0] && (
              <img
                src={post.images[0]}
                alt={post.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-2">{post.description}</p>
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {post.animalType}
              </span>
              <span className={`px-2 py-1 rounded ${
                post.urgency === 'HIGH' 
                  ? 'bg-red-100 text-red-800'
                  : post.urgency === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {post.urgency}
              </span>
            </div>
            <div className="mt-2 text-gray-500 text-sm">
              {post.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
