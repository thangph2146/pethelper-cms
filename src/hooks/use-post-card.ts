import { useMemo } from 'react';
import type { Post, PostRenderProps } from '@/types/post';
import { usePostMenuActions } from '@/hooks/use-post-menu-actions';
import { usePostLoading } from './use-post-loading';
import { usePostView } from './use-post-view';
import { usePostStats } from './use-post-stats';
import { usePostInteractionsHandlers } from './use-post-interactions-handlers';
import { usePostQuery } from './use-post-query';
import { usePostHandlers } from './use-post-handlers';
import { usePostAnimation } from './use-post-animation';
import { usePostDialogs } from './use-post-dialogs';
import { usePostPreview } from './use-post-preview';
import { usePostContent } from './use-post-content';
import { useAuth } from '@/hooks/use-auth';
import { useReadPosts } from '@/hooks/use-read-posts';
import { useStarredPosts } from '@/hooks/use-starred-posts';

export interface UsePostCard {
  view: ReturnType<typeof usePostView>;
  loading: ReturnType<typeof usePostLoading>;
  handlers: {
    handleCardClick: () => void;
    handleDelete: () => Promise<void>;
  };
  renderProps: PostRenderProps;
  dialogs: ReturnType<typeof usePostDialogs>;
  motionProps: ReturnType<typeof usePostAnimation>['motionProps'];
}

export const usePostCard = (post: Post, options: PostCardOptions): PostCardState => {
  return useMemo(() => ({
    view: usePostView(post),
    loading: usePostLoading(post.id),
    handlers: usePostHandlers(post),
    renderProps: usePostRenderProps(post),
    dialogs: usePostDialogs(post),
    motionProps: usePostMotionProps()
  }), [post]);
}; 