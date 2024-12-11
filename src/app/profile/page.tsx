'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useInfinitePosts } from '@/hooks/use-infinite-posts';
import { PostList } from '@/components/PostList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { UserComments } from '@/components/UserComments';

const TABS = [
  { id: 'posts', label: 'Bài đăng của tôi' },
  { id: 'saved', label: 'Đã lưu' },
  { id: 'comments', label: 'Bình luận' }
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('posts');

  const { posts, loading, error, hasMore, loadMore } = useInfinitePosts({
    filters: {
      author: session?.user?.id
    }
  });

  if (status === 'loading') return <LoadingSpinner />;

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || ''}
                className="w-20 h-20 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{session.user?.name}</h1>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.push('/profile/edit')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <nav className="flex gap-4">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'posts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Bài đăng của tôi</h2>
              <button
                onClick={() => router.push('/posts/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Đăng bài mới
              </button>
            </div>
            <PostList filters={{ author: session.user.id }} />
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Bài đăng đã lưu</h2>
            <PostList filters={{ saved: true }} />
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Bình luận của tôi</h2>
            <UserComments />
          </div>
        )}
      </div>
    </div>
  );
} 