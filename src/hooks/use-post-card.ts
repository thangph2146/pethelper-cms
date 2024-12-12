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

export const usePostCard = (post: Post): UsePostCard => {
  // Query & Data hooks
  const { 
    data: interactions,
    isLoading: isInteractionsLoading 
  } = usePostInteractions(post.id);
  const { invalidatePost, invalidatePostList } = usePostQuery(post.id);

  // Auth & User hooks
  const { user } = useAuth();
  const { isRead } = useReadPosts();
  const { isStarred } = useStarredPosts();

  // UI & Animation hooks
  const { isHovered, motionProps } = usePostAnimation();
  const { showContent, toggleContent, contentRef } = usePostContent();
  const dialogs = usePostDialogs(post);
  const preview = usePostPreview(post);

  // Stats & Interactions
  const { 
    stats,
    hasInteractions,
    isLiked,
    isSaved 
  } = usePostStats(interactions);

  const {
    handleLikeClick,
    handleSaveClick,
    handleStarClick,
    isLikeLoading,
    isSaving,
    isStarring
  } = usePostInteractionsHandlers(post.id, stats, invalidatePost);

  // Menu & View
  const menuActions = usePostMenuActions(dialogs, user?.id === post.author.id, isDeleting);
  const view = usePostView(post, {
    isAuthor: user?.id === post.author.id,
    isRead,
    isStarred,
    isHovered,
    hasInteractions
  });

  // Loading states
  const loading = usePostLoading({
    isInteractionsLoading,
    isDeleting,
    isStarring,
    isLikeLoading,
    isSaving
  });

  // Handlers
  const {
    handleCardClick,
    handleDelete
  } = usePostHandlers(post, invalidatePostList);

  // Render props
  const renderProps = useMemo<PostRenderProps>(() => ({
    header: {
      ...view.header,
      onMenuAction: menuActions.handleMenuAction,
      isMenuLoading: menuActions.isMenuLoading
    },
    content: {
      ...view.content,
      showContent,
      toggleContent,
      contentRef,
      onImageClick: preview.handleImageClick
    },
    footer: {
      stats,
      isLiked,
      isSaved,
      hasInteractions,
      onLike: handleLikeClick,
      onComment: dialogs.openComments,
      onSave: handleSaveClick,
      isLikeLoading: loading.isLikeLoading,
      isSaving: loading.isSaving
    },
    quickActions: {
      isStarred: isStarred(post.id),
      onQuickView: preview.handleQuickView,
      onStar: handleStarClick,
      isStarring: loading.isStarring
    }
  }), [/* dependencies */]);

  return {
    view,
    loading,
    handlers: {
      handleCardClick,
      handleDelete
    },
    renderProps,
    dialogs,
    motionProps
  };
}; 