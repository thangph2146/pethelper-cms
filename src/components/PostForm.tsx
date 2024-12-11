'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postApi } from '@/utils/axiosInstance';
import { CreatePostData } from '@/types/post';
import { LoadingButton } from './LoadingSpinner';

interface Props {
  initialData?: CreatePostData;
  onSuccess?: () => void;
}

export function PostForm({ initialData, onSuccess }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePostData>(initialData || {
    title: '',
    content: '',
    category: 'dog',
    status: 'need-help',
    location: '',
    images: [],
    contact: {
      phone: '',
      email: ''
    }
  });
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      
      // Thêm các trường dữ liệu cơ bản
      form.append('title', formData.title);
      form.append('content', formData.content);
      form.append('category', formData.category);
      form.append('status', formData.status);
      form.append('location', formData.location);

      // Thêm thông tin liên hệ
      form.append('contact[phone]', formData.contact.phone);
      if (formData.contact.email) {
        form.append('contact[email]', formData.contact.email);
      }

      // Thêm hình ảnh
      images.forEach((image) => {
        form.append('images', image);
      });

      await postApi.create(form);
      router.push('/posts');
      onSuccess?.();
    } catch (error) {
      console.error('Lỗi khi tạo bài đăng:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-2">Tiêu đề</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Nội dung</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          className="w-full border rounded p-2"
          rows={5}
          required
        />
      </div>

      <div>
        <label className="block mb-2">Loại</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value as CreatePostData['category']})}
          className="w-full border rounded p-2"
          required
        >
          <option value="dog">Chó</option>
          <option value="cat">Mèo</option>
          <option value="other">Khác</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Trạng thái</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value as CreatePostData['status']})}
          className="w-full border rounded p-2"
          required
        >
          <option value="need-help">Cần giúp đỡ</option>
          <option value="being-helped">Đang được giúp</option>
          <option value="helped">Đã được giúp</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Địa điểm</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Số điện thoại liên hệ</label>
        <input
          type="tel"
          value={formData.contact.phone}
          onChange={(e) => setFormData({
            ...formData,
            contact: {...formData.contact, phone: e.target.value}
          })}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Email liên hệ (không bắt buộc)</label>
        <input
          type="email"
          value={formData.contact.email}
          onChange={(e) => setFormData({
            ...formData,
            contact: {...formData.contact, email: e.target.value}
          })}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-2">Hình ảnh</label>
        <input
          type="file"
          onChange={(e) => e.target.files && setImages(Array.from(e.target.files))}
          multiple
          accept="image/*"
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? <LoadingButton /> : 'Tạo bài đăng'}
      </button>
    </form>
  );
} 