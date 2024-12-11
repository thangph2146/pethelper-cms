'use client';

import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { PostCard } from './post-card';
import { Spinner } from '@/components/ui/spinner';
import { useInfinitePosts } from '@/hooks/use-infinite-posts';
import { PostService } from '@/services/post.service';
import type { IPost } from '@backend/models/Post';

interface PostListProps {
  filters?: {
    status?: 'need_help' | 'helping' | 'helped';
    animalType?: 'dog' | 'cat' | 'other';
    search?: string;
  };
}

export function PostList({ filters }: PostListProps) {
  const { ref, inView } = useInView();
  const { 
    data, 
    status, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfinitePosts({ filters });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'error') {
    return (
      <div className="text-center p-8 text-red-500">
        Có lỗi xảy ra khi tải dữ liệu
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (!data || data.pages[0].posts.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Không có bài đăng nào
      </div>
    );
  }

  const handleLike = async (postId: string) => {
    try {
      await PostService.likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUnlike = async (postId: string) => {
    try {
      await PostService.unlikePost(postId);
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };

  return (
    <div className="space-y-6">
      {data.pages.map((page, i) => (
        <div key={i} className="space-y-6">
          {page.posts.map((post: IPost) => (
            <PostCard 
              key={post._id}
              post={post}
              onLike={() => handleLike(post._id)}
              onUnlike={() => handleUnlike(post._id)}
            />
          ))}
        </div>
      ))}

      <div ref={ref}>
        {isFetchingNextPage && (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        )}
      </div>
      
      {!hasNextPage && data.pages[0].posts.length > 0 && (
        <p className="text-center text-gray-500">
          Không còn bài đăng nào khác
        </p>
      )}
    </div>
  );
} 