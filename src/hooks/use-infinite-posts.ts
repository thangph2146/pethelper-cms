import { useInfiniteQuery } from '@tanstack/react-query';
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
    queryKey: ['posts', filters] as const,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await PostService.getAllPosts(Number(pageParam), filters);
      return response;
    },  
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) return undefined;
      return lastPage.totalPages + 1;
    },
    initialPageParam: 1,
  });
} 