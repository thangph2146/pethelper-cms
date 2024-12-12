'use client';

import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { usePostService } from '@/hooks/use-post-service';
import { usePostInteractions } from '@/hooks/use-post-interactions';
import { useReadPosts } from '@/hooks/use-read-posts';
import { useStarredPosts } from '@/hooks/use-starred-posts';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { PostCardProps } from '@/types/post';

import { PostHeader } from './post/post-header';
import { PostContent } from './post/post-content';
import { PostFooter } from './post/post-footer';
import { PostActions } from './post/post-actions';
import { PostPreview } from './post/post-preview';
import { PostImages } from './post/post-images';
import { usePostHandlers } from '@/hooks/use-post-handlers';
import { usePostComputed } from '@/hooks/use-post-computed';
import { usePostPreview } from '@/hooks/use-post-preview';
import { usePostContent } from '@/hooks/use-post-content';
import { usePostDialogs } from '@/hooks/use-post-dialogs';

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { ReportDialog } from '@/components/report-dialog';
import { Comments } from '@/components/comments';
import { ShareDialog } from '@/components/share-dialog';
import { PostMenu } from '@/components/post-menu';

const PostCardErrorBoundary = ({ error }: { error: Error }) => (
  <Card className="p-4">
    <div className="space-y-2">
      <p className="text-red-500 font-medium">Có lỗi xảy ra khi hiển thị bài viết</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => window.location.reload()}
      >
        Tải lại trang
      </Button>
    </div>
  </Card>
);

export const PostCard = memo(({ post }: PostCardProps) => {
  const { user } = useAuth();
  const { isRead } = useReadPosts();
  const { isStarred } = useStarredPosts();
  const { data: interactions } = usePostInteractions(post.id);
  const [isHovered, setIsHovered] = useState(false);

  const dialogs = usePostDialogs(post);
  const preview = usePostPreview(post);
  const content = usePostContent();
  const isAuthor = user?.id === post.author.id;

  const {
    isDeleting,
    isStarring,
    isLikeLoading,
    isSaving,
    handleCardClick,
    handleLikeClick,
    handleSaveClick,
    handleStarClick,
    handleDelete,
    handleMenuAction
  } = usePostHandlers(post, dialogs, interactions);

  const { formattedDate, statusColor, urgencyColor, cardClassName } = usePostComputed(
    post, 
    isRead,
    isStarred,
    isHovered
  );

  return (
    <ErrorBoundary FallbackComponent={PostCardErrorBoundary}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className={cardClassName} onClick={handleCardClick}>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <PostHeader
                author={post.author}
                date={formattedDate}
                status={post.status}
                statusColor={statusColor}
              />
              <PostMenu 
                isAuthor={isAuthor}
                onAction={handleMenuAction}
              />
            </div>

            <PostContent
              title={post.title}
              content={post.content}
              showContent={content.showContent}
              toggleContent={content.toggleContent}
              contentRef={content.contentRef}
            />

            {post.images && post.images.length > 0 && (
              <PostImages
                images={post.images}
                onImageClick={preview.handleImageClick}
              />
            )}

            <PostFooter
              stats={interactions || {
                hasLiked: false,
                hasCommented: false,
                hasSaved: false,
                likeCount: 0,
                commentCount: 0,
                saveCount: 0
              }}
              onLike={handleLikeClick}
              onComment={dialogs.openComments}
              onSave={handleSaveClick}
              isLikeLoading={isLikeLoading}
              isSaving={isSaving}
            />
          </div>

          <PostActions
            isStarred={isStarred(post.id)}
            onQuickView={preview.handleQuickView}
            onStar={handleStarClick}
            isStarring={isStarring}
          />
        </Card>

        <PostPreview
          post={post}
          open={preview.showPreview}
          onOpenChange={preview.setShowPreview}
          statusColor={statusColor}
          urgencyColor={urgencyColor}
          formattedDate={formattedDate}
          onImageClick={preview.handleImageClick}
        />

        <AlertDialog open={preview.showDeleteAlert} onOpenChange={preview.setShowDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600"
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa bài viết'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ReportDialog
          open={preview.showReportDialog}
          onOpenChange={preview.setShowReportDialog}
          postId={post.id}
        />

        <Comments
          postId={post.id}
          open={dialogs.showComments}
          onOpenChange={dialogs.setShowComments}
        />

        <ShareDialog
          open={dialogs.showShareDialog}
          onOpenChange={dialogs.setShowShareDialog}
          post={post}
        />
      </motion.div>
    </ErrorBoundary>
  );
});
