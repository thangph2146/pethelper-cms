'use client';

import React from 'react';
import Image from 'next/image';
import { IPost } from '@/types/post';
import { formatDate } from '@/utils/format';

interface Props {
  post: IPost;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostDetail({ post, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>Đăng bởi: {post.author.name}</span>
          <span>•</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      {post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {post.images.map((image, index) => (
            <div key={index} className="relative aspect-video">
              <Image
                src={image}
                alt={`Ảnh ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      <div className="prose max-w-none mb-6">
        <p>{post.content}</p>
      </div>

      <div className="flex gap-2 mb-6">
        <span className={`px-3 py-1 rounded-full text-sm ${
          post.status === 'need-help' ? 'bg-red-100 text-red-800' :
          post.status === 'being-helped' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {post.status === 'need-help' ? 'Cần giúp đỡ' :
           post.status === 'being-helped' ? 'Đang được giúp' :
           'Đã được giúp'}
        </span>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {post.category === 'dog' ? 'Chó' :
           post.category === 'cat' ? 'Mèo' : 'Khác'}
        </span>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Thông tin liên hệ</h2>
        <div className="space-y-1">
          <p>Địa điểm: {post.location}</p>
          <p>Điện thoại: {post.contact.phone}</p>
          {post.contact.email && <p>Email: {post.contact.email}</p>}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-4">
          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Chỉnh sửa
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Xóa bài
            </button>
          )}
        </div>
      )}
    </div>
  );
} 