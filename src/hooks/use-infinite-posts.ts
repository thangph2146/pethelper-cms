import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { PostService } from '@/services/post.service';
import type { IPost } from '@backend/models/Post';

interface UseInfinitePostsOptions {
  filters?: {
    status?: 'need_help' | 'helping' | 'helped';
    animalType?: 'dog' | 'cat' | 'other';
    search?: string;
  };
}

interface PostsResponse {
  posts: IPost[];
  hasNextPage: boolean;
  totalPages: number;
}

export function useInfinitePosts({ filters }: UseInfinitePostsOptions = {}) {
  return useInfiniteQuery<PostsResponse>({
    queryKey: ['posts', filters],
    queryFn: async ({ pageParam = 1 }: { pageParam?: number, queryKey: QueryKey, signal?: AbortSignal }) => {
      const params = new URLSearchParams();
      params.append('page', String(pageParam));
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const response = await PostService.getAllPosts(pageParam, {
        ...filters,
        page: String(pageParam)
      });

      return {
        posts: response.data.posts,
        hasNextPage: response.data.hasNextPage,
        totalPages: response.data.totalPages,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) return undefined;
      return lastPage.totalPages + 1;
    },
    initialPageParam: 1,
  });
} 