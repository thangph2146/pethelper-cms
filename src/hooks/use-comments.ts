import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentService } from '@/services/comment.service';
import type { IComment } from '@backend/models/Comment';

export const useComments = (postId: string) => {
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery<IComment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await CommentService.getComments(postId);
      return response;
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => CommentService.addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      CommentService.updateComment(postId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => CommentService.deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: string) => CommentService.likeComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const unlikeCommentMutation = useMutation({
    mutationFn: (commentId: string) => CommentService.unlikeComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  return {
    comments,
    isLoading,
    addComment: addCommentMutation.mutate,
    updateComment: updateCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    likeComment: likeCommentMutation.mutate,
    unlikeComment: unlikeCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isLikingComment: likeCommentMutation.isPending,
    isUnlikingComment: unlikeCommentMutation.isPending,
  };
}; 