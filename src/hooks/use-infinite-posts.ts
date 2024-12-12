import { useInfiniteQuery } from '@tanstack/react-query';
import { PostService } from '@/services/post.service';
import type { IPost, PostsResponse } from '@/types/post';
import { useCallback } from 'react';

interface UseInfinitePostsFilters {
  keyword?: string;
  type?: 'dog' | 'cat' | 'other';
  status?: 'need_help' | 'helping' | 'helped';
  urgency?: 'high' | 'medium' | 'low';
  limit?: number;
}

export interface UseInfinitePostsParams {
  filters: UseInfinitePostsFilters;
  limit: number;
}

export const useInfinitePosts = ({ filters, limit }: UseInfinitePostsParams) => {
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.urgency) params.append('urgency', filters.urgency);
    if (filters.keyword?.trim()) params.append('keyword', filters.keyword.trim());
    if (limit) params.append('limit', limit.toString());
    
    return params.toString();
  }, [filters, limit]);

  return useInfiniteQuery<PostsResponse>({
    queryKey: ['posts', filters, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const queryString = buildQueryParams();
      const url = `/api/posts?page=${pageParam}${queryString ? `&${queryString}` : ''}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu bài viết');
        }
        const data = await response.json();
        
        return {
          ...data,
          data: data.data.map((post: IPost) => ({
            ...post,
            id: post._id,
            created_at: post.createdAt,
            updated_at: post.updatedAt,
            user_id: post.author._id
          }))
        };
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
  });
}; 