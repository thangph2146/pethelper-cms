import { useQuery } from '@tanstack/react-query';
import { PostService } from '@/services/post.service';
import { GetPostByIdResponse } from '@/types/post';

export function usePost(id: string) {
  return useQuery<GetPostByIdResponse>({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await PostService.getPostById(id);
      return response.data as unknown as GetPostByIdResponse;
    },
  });
}