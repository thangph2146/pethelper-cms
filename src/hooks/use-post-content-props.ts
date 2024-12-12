import { useMemo } from 'react';
import type { PostLoadingStates, Post, PostCardView, PostDialogProps, PostRenderProps, PostCardHandlers } from '@/types/post';

interface UsePostContentPropsParams {
  loadingStates: PostLoadingStates;
  cardProps: {
    className: string;
    onClick: () => void;
    'data-testid': string;
    'aria-disabled': boolean;
  };
  renderProps: PostRenderProps;
  showPreview: boolean;
  post: Post;
  view: PostCardView;
  dialogs: PostDialogProps['dialogs'];
  handlers: PostCardHandlers;
}

export const usePostContentProps = ({
  loadingStates,
  cardProps,
  renderProps,
  showPreview,
  post,
  view,
  dialogs,
  handlers
}: UsePostContentPropsParams) => {
  return useMemo(() => ({
    loading: loadingStates,
    cardProps,
    renderProps,
    showPreview,
    post,
    view,
    dialogs,
    onDelete: handlers.handleDelete,
    onShare: handlers.handleShare
  }), [
    loadingStates,
    cardProps,
    renderProps,
    showPreview,
    post,
    view,
    dialogs,
    handlers
  ]);
}; 