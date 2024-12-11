'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/utils/axiosInstance';
import { LoadingSpinner } from '../LoadingSpinner';
import type { IReport } from '@/types/report';

export function ReportList() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['reports', page],
    queryFn: async () => {
      const { data } = await axios.get(`/admin/reports?page=${page}`);
      return data.data;
    }
  });

  const resolveMutation = useMutation({
    mutationFn: (reportId: string) => axios.post(`/admin/reports/${reportId}/resolve`),
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (reportId: string) => axios.post(`/admin/reports/${reportId}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Bài đăng</th>
              <th className="px-6 py-3 text-left">Người báo cáo</th>
              <th className="px-6 py-3 text-left">Lý do</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data?.reports.map((report: IReport) => (
              <tr key={report._id} className="border-b">
                <td className="px-6 py-4">
                  <a href={`/posts/${report.post._id}`} className="text-blue-600 hover:underline">
                    {report.post.title}
                  </a>
                </td>
                <td className="px-6 py-4">{report.user.name}</td>
                <td className="px-6 py-4">{report.reason}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status === 'pending' ? 'Chờ xử lý' :
                     report.status === 'resolved' ? 'Đã xử lý' : 'Đã từ chối'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => resolveMutation.mutate(report._id)}
                        className="text-green-600 hover:text-green-800 mr-4"
                      >
                        Xử lý
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(report._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          {Array.from({ length: data.pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 