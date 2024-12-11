'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chào mừng đến với PetHelper
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Nền tảng kết nối và hỗ trợ cứu trợ động vật
        </p>
        <div className="space-x-4">
          <Link
            href="/posts"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Xem danh sách
          </Link>
          <Link
            href="/posts/create"
            className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-md border-2 border-indigo-600 hover:bg-indigo-50"
          >
            Tạo bài đăng
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-4">Dễ dàng chia sẻ</h3>
          <p className="text-gray-600">
            Đăng thông tin về các trường hợp động vật cần được giúp đỡ
          </p>
        </div>
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-4">Kết nối nhanh chóng</h3>
          <p className="text-gray-600">
            Tìm kiếm và liên hệ với những người có thể giúp đỡ
          </p>
        </div>
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-4">Cộng đồng rộng lớn</h3>
          <p className="text-gray-600">
            Tham gia cộng đồng những người yêu thương động vật
          </p>
        </div>
      </div>
    </div>
  );
}

