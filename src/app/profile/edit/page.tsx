'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { UploadService } from '@/services/upload.service';

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    image: session?.user?.image || '',
    phone: '',
    address: ''
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const imageUrl = await UploadService.uploadImage(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast.success('Tải ảnh lên thành công');
    } catch (err) {
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Gọi API cập nhật thông tin người dùng
      await update({
        ...session,
        user: {
          ...session?.user,
          ...formData
        }
      });
      toast.success('Cập nhật thông tin thành công');
      router.push('/profile');
    } catch (err) {
      toast.error('Lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Chỉnh sửa thông tin cá nhân</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Ảnh đại diện</label>
            <div className="flex items-center gap-4">
              <img
                src={formData.image || '/default-avatar.png'}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
              >
                Thay đổi ảnh
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-2">Tên hiển thị</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Số điện thoại</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">Địa chỉ</label>
            <textarea
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 