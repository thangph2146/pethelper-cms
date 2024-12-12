'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useInfinitePosts } from '@/hooks/use-infinite-posts';
import { PostService } from '@/services/post.service';
import type { AdminPost } from '@/types/admin';

const STATUS_LABELS = {
  'cần_giúp_đỡ': 'Cần giúp đỡ',
  'đang_hỗ_trợ': 'Đang hỗ trợ',
  'đã_giải_quyết': 'Đã giải quyết'
} as const;

export default function AdminPostsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<keyof typeof STATUS_LABELS | ''>('');

  const { posts, loading, hasMore, loadMore } = useInfinitePosts({
    filters: selectedStatus ? { status: selectedStatus } : undefined,
    limit: 20
  });

  const adminPosts = posts.map(post => ({
    ...post,
    author: {
      _id: post.author._id,
      name: post.author.name || '',
      email: post.author.email || '',
      image: post.author.image
    }
  })) as AdminPost[];

  const handleStatusChange = async (postId: string, newStatus: keyof typeof STATUS_LABELS) => {
    try {
      await PostService.updatePost(postId, { status: newStatus });
      router.refresh();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) return;

    try {
      await PostService.deletePost(postId);
      router.refresh();
    } catch (error) {
      console.error('Lỗi khi xóa bài đăng:', error);
      alert('Có lỗi xảy ra khi xóa bài đăng');
    }
  };

  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý bài đăng</h1>

      <div className="mb-6">
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value as keyof typeof STATUS_LABELS)}
          className="p-2 border rounded-lg"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Danh sách bài đăng */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người đăng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adminPosts.map(post => (
              <tr key={post._id}>
                <td className="px-6 py-4">
                  <a 
                    href={`/posts/${post._id}`}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {post.title}
                  </a>
                </td>
                <td className="px-6 py-4">
                  {post.author.name}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={post.status}
                    onChange={e => handleStatusChange(post._id, e.target.value as keyof typeof STATUS_LABELS)}
                    className="p-1 border rounded"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Đang tải...' : 'Tải thêm'}
          </button>
        </div>
      )}
    </div>
  );
} 