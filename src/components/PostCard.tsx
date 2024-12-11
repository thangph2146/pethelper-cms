'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IPost } from '@/types/post';

interface Props {
  post: IPost;
}

export function PostCard({ post }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      {post.images[0] && (
        <div className="relative h-48">
          <Image
            src={post.images[0]}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">
          <Link href={`/posts/${post._id}`} className="hover:text-blue-500">
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
        <div className="flex gap-2 mb-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {post.category === 'dog' ? 'Chó' : post.category === 'cat' ? 'Mèo' : 'Khác'}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
            {post.status === 'need-help' ? 'Cần giúp đỡ' : 
             post.status === 'being-helped' ? 'Đang được giúp' : 'Đã được giúp'}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          <p>Địa điểm: {post.location}</p>
          <p>Liên hệ: {post.contact.phone}</p>
          <p>Đăng bởi: {post.author.name}</p>
          <p>Ngày đăng: {new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
        </div>
      </div>
    </div>
  );
} 