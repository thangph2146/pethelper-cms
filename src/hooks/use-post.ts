import { useQuery } from '@tanstack/react-query';
import { PostService } from '@/services/post.service';
import type { IPost } from '@backend/models/Post';

export function usePost(id: string) {
  return useQuery<IPost>({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await PostService.getPost(id);
      return response.data;
    },
  });
}