'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/utils/axiosInstance';
import { LoadingSpinner } from '../LoadingSpinner';
import { ConfirmDialog } from '../ConfirmDialog';
import type { IUser } from '@/types/user';

export function UserList() {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      const { data } = await axios.get(`/admin/users?page=${page}`);
      return data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => axios.delete(`/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  });

  const toggleBlockMutation = useMutation({
    mutationFn: (userId: string) => axios.post(`/admin/users/${userId}/toggle-block`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Tên</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Vai trò</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((user: IUser) => (
              <tr key={user._id} className="border-b">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.blocked ? 'Đã chặn' : 'Hoạt động'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleBlockMutation.mutate(user._id)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    {user.blocked ? 'Bỏ chặn' : 'Chặn'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteDialog(true);
                    }}
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

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa người dùng ${selectedUser?.name}?`}
        onConfirm={() => selectedUser && deleteMutation.mutate(selectedUser._id)}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
} 