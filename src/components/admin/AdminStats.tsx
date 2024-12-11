'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/utils/axiosInstance';
import { LoadingSpinner } from '../LoadingSpinner';
import type { ApiResponse, AdminStats } from '@/types/api';

export function AdminStats() {
  const { data: stats, isLoading } = useQuery<ApiResponse<AdminStats>>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await axios.get('/admin/stats');
      return data;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  const statsData = stats?.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Thống kê bài đăng */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Bài đăng</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tổng số:</span>
            <span className="font-medium">{statsData?.posts.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Cần giúp đỡ:</span>
            <span className="font-medium text-red-600">{statsData?.posts.needHelp}</span>
          </div>
          <div className="flex justify-between">
            <span>Đang được giúp:</span>
            <span className="font-medium text-yellow-600">{statsData?.posts.beingHelped}</span>
          </div>
          <div className="flex justify-between">
            <span>Đã giải quyết:</span>
            <span className="font-medium text-green-600">{statsData?.posts.helped}</span>
          </div>
        </div>
      </div>

      {/* Thống kê người dùng */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Người dùng</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tổng số:</span>
            <span className="font-medium">{statsData?.users.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Đang hoạt động:</span>
            <span className="font-medium text-green-600">{statsData?.users.active}</span>
          </div>
        </div>
      </div>

      {/* Thống kê báo cáo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Báo cáo</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tổng số:</span>
            <span className="font-medium">{statsData?.reports.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Chưa xử lý:</span>
            <span className="font-medium text-red-600">{statsData?.reports.pending}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 