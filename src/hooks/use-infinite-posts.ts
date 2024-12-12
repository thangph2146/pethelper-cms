import { useInfiniteQuery } from '@tanstack/react-query';
import { PostService } from '@/services/post.service';
import type { PostResponse } from '@/types/post';

interface UseInfinitePostsOptions {
  filters?: {
    status?: 'need_help' | 'helping' | 'helped';
    animalType?: 'dog' | 'cat' | 'other';
    search?: string;
  };
}



export function useInfinitePosts({ filters }: UseInfinitePostsOptions = {}) {
  return useInfiniteQuery<PostResponse>({
    queryKey: ['posts', filters] as const,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await PostService.getAllPosts(Number(pageParam), filters);
      return response;
    },  
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.totalPages) return undefined;
      return lastPage.pagination.page + 1;
    },
    initialPageParam: 1,
  });
} 