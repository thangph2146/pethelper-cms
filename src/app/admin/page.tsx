'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AdminStats } from '@/components/admin/AdminStats';
import { PostList } from '@/components/PostList';
import { UserList } from '@/components/admin/UserList';
import { ReportList } from '@/components/admin/ReportList';

type TabType = 'posts' | 'users' | 'reports' | 'stats';

export default function AdminPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  if (!session || session.user.role !== 'admin') {
    return <div>Không có quyền truy cập</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Quản lý hệ thống</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Thống kê
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'posts' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Bài đăng
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Người dùng
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Báo cáo
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'stats' && <AdminStats />}
        {activeTab === 'posts' && (
          <PostList 
            filters={{ status: 'all' }}
            showActions={true}
            showPagination={true}
          />
        )}
        {activeTab === 'users' && <UserList />}
        {activeTab === 'reports' && <ReportList />}
      </div>
    </div>
  );
} 