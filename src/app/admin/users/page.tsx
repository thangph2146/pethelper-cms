'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  status: 'active' | 'blocked';
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
      } catch (err) {
        setError('Lỗi khi tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [session]);

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, { status: newStatus });
      setUsers(prev => 
        prev.map(user => 
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, { role: newRole });
      setUsers(prev => 
        prev.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (status === 'loading' || loading) return <div>Đang tải...</div>;

  if (!session?.user || session.user.role !== 'admin') {
    router.push('/');
    return null;
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Quản lý người dùng</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Tên</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Vai trò</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Ngày tham gia</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user._id}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user._id, e.target.value as User['role'])}
                    className="p-1 border rounded"
                    disabled={user._id === session.user.id}
                  >
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.status}
                    onChange={e => handleStatusChange(user._id, e.target.value as User['status'])}
                    className="p-1 border rounded"
                    disabled={user._id === session.user.id}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="blocked">Đã chặn</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 