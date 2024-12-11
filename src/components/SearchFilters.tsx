'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/posts?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Loại</label>
          <select
            value={searchParams.get('category') || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Tất cả</option>
            <option value="dog">Chó</option>
            <option value="cat">Mèo</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Trạng thái</label>
          <select
            value={searchParams.get('status') || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Tất cả</option>
            <option value="need-help">Cần giúp đỡ</option>
            <option value="being-helped">Đang được giúp</option>
            <option value="helped">Đã được giúp</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mức độ khẩn cấp</label>
          <select
            value={searchParams.get('urgency') || ''}
            onChange={(e) => handleFilterChange('urgency', e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Tất cả</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Địa điểm</label>
          <input
            type="text"
            value={searchParams.get('location') || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="Nhập địa điểm"
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>
    </div>
  );
} 