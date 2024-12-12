import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentService } from '@/services/comment.service';

export function useComments(postId?: string) {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => CommentService.getComments(postId!),
    enabled: !!postId
  });

  const { mutateAsync: addComment } = useMutation({
    mutationFn: (content: string) => 
      CommentService.addComment(postId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  return {
    comments,
    isLoading,
    addComment
  };
} 