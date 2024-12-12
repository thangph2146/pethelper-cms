import { memo } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { ReportDialog } from '@/components/report-dialog';
import { Comments } from '@/components/comments';
import { ShareDialog } from '@/components/share-dialog';
import type { Post } from '@/types/post';
import type { UsePostPreviewDialog } from '@/hooks/use-post-preview-dialog';
import type { UsePostDialogs } from '@/hooks/use-post-dialogs';
import { PostPreviewDialog } from '@/components/post/post-preview-dialog';
import { usePostDialogActions } from '@/hooks/use-post-dialog-actions';

export interface PostDialogProps {
  post: Post;
  preview: UsePostPreviewDialog['preview'];
  dialogs: UsePostDialogs;
  view: UsePostPreviewDialog['view'];
  loading: {
    isDeleting: boolean;
  };
  onDelete: () => Promise<void>;
}

export const PostDialogs = memo(({
  post,
  preview,
  dialogs,
  view,
  loading,
  onDelete
}: PostDialogProps) => {
  const actions = usePostDialogActions(dialogs, onDelete);

  return (
    <>
      <PostPreviewDialog
        post={post}
        open={preview.showPreview}
        onOpenChange={preview.setShowPreview}
        selectedImage={preview.selectedImage}
        onImageClick={preview.handleImageClick}
        {...view}
      />

      <AlertDialog 
        open={dialogs.showDeleteAlert} 
        onOpenChange={dialogs.setShowDeleteAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={loading.isDeleting}
              onClick={actions.handleClose}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={actions.handleDelete}
              disabled={loading.isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {loading.isDeleting ? 'Đang xóa...' : 'Xóa bài viết'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReportDialog
        open={dialogs.showReportDialog}
        onOpenChange={dialogs.setShowReportDialog}
        postId={post.id}
        onClose={actions.handleClose}
      />

      <Comments
        postId={post.id}
        open={dialogs.showComments}
        onOpenChange={dialogs.setShowComments}
        onClose={actions.handleClose}
      />

      <ShareDialog
        open={dialogs.showShareDialog}
        onOpenChange={dialogs.setShowShareDialog}
        post={post}
        onClose={actions.handleClose}
      />
    </>
  );
}); 