import { memo } from 'react';
import type { Post, PostDialogProps } from '@/types/post';
import { usePostPreviewDialog } from '@/hooks/use-post-preview-dialog';
import { PostDialogs } from './post-dialogs';
import type { PostLoadingStates } from '@/hooks/use-post-loading-states';

interface PostPreviewWrapperProps {
  post: Post;
  view: {
    header: {
      statusColor: string;
      urgencyColor: string;
      date: string;
    };
  };
  dialogs: PostDialogProps['dialogs'];
  loading: PostLoadingStates;
  onDelete: () => Promise<void>;
  onShare: () => Promise<void>;
}

export const PostPreviewWrapper = memo(({
  post,
  view,
  dialogs,
  loading,
  onDelete,
  onShare
}: PostPreviewWrapperProps) => {
  const previewDialog = usePostPreviewDialog(post, {
    statusColor: view.header.statusColor,
    urgencyColor: view.header.urgencyColor,
    formattedDate: view.header.date
  });

  return (
    <PostDialogs
      post={post}
      preview={previewDialog.preview}
      dialogs={dialogs}
      view={previewDialog.view}
      loading={loading}
      onDelete={onDelete}
      onShare={onShare}
      data-testid="post-dialogs"
    />
  );
});

PostPreviewWrapper.displayName = 'PostPreviewWrapper'; 