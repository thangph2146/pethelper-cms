'use client';

import { useState } from 'react';
import { PostList } from '@/components/post/post-list';
import { PostFilters } from '@/components/post/post-filters';
import { CreatePostButton } from '@/components/post/create-post-button';

export default function PostsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Danh sách bài đăng</h1>
        <CreatePostButton />
      </div>
      <PostFilters onFilterChange={setFilters} />
      <PostList filters={filters} />
    </div>
  );
} 