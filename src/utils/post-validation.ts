import { POST_MESSAGES } from '@/constants/post-messages';
import type { Post } from '@/types/post';
import { logger } from '@/services/log-service';

export const validatePost = (post: Post | null | undefined) => {
  if (!post?.id) {
    logger.error({
      message: 'PostCard Validation Error: Missing post id',
      data: { post },
      component: 'PostCard'
    });
    throw new Error(POST_MESSAGES.errors.required);
  }
  
  if (!post.author?.name) {
    logger.error({
      message: 'PostCard Validation Error: Missing author name',
      data: { post },
      component: 'PostCard'
    });
    throw new Error(POST_MESSAGES.errors.invalidAuthor);
  }

  return post;
}; 