import { useMemo } from 'react';
import type { Post, PostRenderProps } from '@/types/post';

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
  // Auth & Data hooks
  const { user } = useAuth();
  const { isRead } = useReadPosts();
  const { isStarred } = useStarredPosts();
  const { 
    stats,
    isLoading: isInteractionsLoading 
  } = usePostInteractions(post.id);
  const { invalidatePost, invalidatePostList } = usePostQuery(post.id);

  // UI state hooks
  const { isHovered, motionProps } = usePostAnimation();
  const dialogs = usePostDialogs(post);
  const preview = usePostPreview(post);
  const content = usePostContent();
  
  // Computed values
  const isAuthor = user?.id === post.author.id;
  const { 
    formattedDate, 
    statusColor, 
    urgencyColor, 
    cardClassName 
  } = usePostComputed(
    post, 
    isRead,
    isStarred,
    isHovered
  );

  const view = usePostView(
    post,
    formattedDate,
    statusColor,
    cardClassName,
    isAuthor
  );

  // Handlers and loading states
  const {
    isDeleting,
    isStarring,
    isLikeLoading,
    isSaving,
    handleCardClick,
    handleLikeClick,
    handleSaveClick,
    handleStarClick,
    handleDelete: handleDeletePost,
    handleMenuAction
  } = usePostHandlers(post, dialogs, stats);

  const loading = usePostLoading(
    isInteractionsLoading,
    isDeleting,
    isStarring,
    isLikeLoading,
    isSaving
  );

  const handleDelete = useCallback(async () => {
    await handleDeletePost();
    invalidatePostList();
  }, [handleDeletePost, invalidatePostList]);

  const renderProps = useMemo<PostRenderProps>(() => ({
    header: {
      ...view.header,
      onMenuAction: handleMenuAction
    },
    content: {
      ...view.content,
      showContent: content.showContent,
      toggleContent: content.toggleContent,
      contentRef: content.contentRef,
      onImageClick: preview.handleImageClick
    },
    footer: {
      stats,
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
  }), [
    view,
    handleMenuAction,
    content,
    preview,
    stats,
    handleLikeClick,
    dialogs.openComments,
    handleSaveClick,
    loading,
    post.id,
    isStarred,
    handleStarClick
  ]);

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