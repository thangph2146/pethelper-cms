'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Stats {
  totalPosts: number;
  totalUsers: number;
  postsToday: number;
  postsByStatus: Record<string, number>;
  postsByType: Record<string, number>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchStats();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return <div>Đang tải...</div>;
  }

  if (!session?.user || session.user.role !== 'admin') {
    router.push('/');
    return null;
  }

  if (!stats) return <div>Không thể tải thống kê</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Thống kê</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Tổng số bài đăng</h3>
          <p className="text-3xl font-bold">{stats.totalPosts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Tổng số người dùng</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Bài đăng hôm nay</h3>
          <p className="text-3xl font-bold">{stats.postsToday}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Theo trạng thái</h3>
          <div className="space-y-2">
            {Object.entries(stats.postsByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between">
                <span>{status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Theo loại</h3>
          <div className="space-y-2">
            {Object.entries(stats.postsByType).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span>{type === 'dog' ? 'Chó' : type === 'cat' ? 'Mèo' : 'Khác'}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 