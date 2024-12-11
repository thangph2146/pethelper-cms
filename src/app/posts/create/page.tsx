'use client';
import React from 'react';
import { CreatePostForm } from '@/components/post/create-post-form';

export default function CreatePostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tạo bài đăng mới</h1>
      <div className="max-w-2xl mx-auto">
        <CreatePostForm />
      </div>
    </div>
  );
} 