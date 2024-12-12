'use client';

import { memo, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { usePostInteractions } from '@/hooks/use-post-interactions';
import { useReadPosts } from '@/hooks/use-read-posts';
import { useStarredPosts } from '@/hooks/use-starred-posts';
import { motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import type { PostCardProps, PostRenderProps } from '@/types/post';

import { PostHeader } from './post/post-header';
import { PostContent } from './post/post-content';
import { PostFooter } from './post/post-footer';
import { PostImages } from './post/post-images';
import { usePostHandlers } from '@/hooks/use-post-handlers';
import { usePostComputed } from '@/hooks/use-post-computed';
import { usePostPreview } from '@/hooks/use-post-preview';
import { usePostContent } from '@/hooks/use-post-content';
import { usePostDialogs } from '@/hooks/use-post-dialogs';
import { usePostStats } from '@/hooks/use-post-stats';

import { PostMenu } from '@/components/post/post-menu';
import { usePostAnimation } from '@/hooks/use-post-animation';
import { PostDialogs } from './post/post-dialogs';
import { PostQuickActions } from './post/post-quick-actions';
import { PostSkeleton } from './post/post-skeleton';
import { PostError } from './post/post-error';
import { usePostLoading } from '@/hooks/use-post-loading';
import { usePostQuery } from '@/hooks/use-post-query';
import { usePostView } from '@/hooks/use-post-view';
import { PostRender } from './post/post-render';
import { usePostCard } from '@/hooks/use-post-card';
import { usePostError } from '@/hooks/use-post-error';
import { usePostPreviewDialog } from '@/hooks/use-post-preview-dialog';

const PostCardErrorBoundary = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <PostError 
    error={error}
    onRetry={resetErrorBoundary}
  />
);

export const PostCard = memo(({ post }: PostCardProps) => {
  const {
    view,
    loading,
    handlers,
    renderProps,
    dialogs,
    motionProps
  } = usePostCard(post);

  const { resetError } = usePostError(post.id);

  const previewDialog = usePostPreviewDialog(post, {
    statusColor: view.header.statusColor,
    urgencyColor: view.header.urgencyColor,
    formattedDate: view.header.date
  });

  // Early return for loading state
  if (loading.isLoading) {
    return <PostSkeleton />;
  }

  // Memoize dialog render to prevent unnecessary re-renders
  const renderDialogs = useMemo(() => (
    <PostDialogs
      post={post}
      preview={previewDialog.preview}
      dialogs={dialogs}
      view={previewDialog.view}
      loading={{
        isDeleting: loading.isDeleting
      }}
      onDelete={handlers.handleDelete}
    />
  ), [
    post,
    previewDialog,
    dialogs,
    loading.isDeleting,
    handlers.handleDelete
  ]);

  return (
    <ErrorBoundary 
      FallbackComponent={PostCardErrorBoundary}
      onReset={resetError}
    >
      <motion.div {...motionProps}>
        <Card 
          className={view.className} 
          onClick={handlers.handleCardClick}
        >
          <PostRender props={renderProps} />
        </Card>
        {renderDialogs}
      </motion.div>
    </ErrorBoundary>
  );
});

