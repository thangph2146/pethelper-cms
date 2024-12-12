'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PostCardProps } from '@/types/post';
import { useRouter } from 'next/navigation';

export const PostCard = ({ post }: PostCardProps) => {
  const router = useRouter();

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="text-gray-600 mt-2 line-clamp-3">{post.content}</p>
          <div className="mt-4 text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString('vi-VN')}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/posts/${post.id}`)}
        >
          Xem chi tiết
        </Button>
      </div>
    </Card>
  );
}; 