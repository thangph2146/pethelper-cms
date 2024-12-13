import type { Post } from '@/types/post';
import type { LoadingState } from '@/types/loading';

export interface PostState {
  post: Post;
  loading: LoadingState;
  error: boolean;
  isReady: boolean;
}

export const usePostState = ({
  post,
  loading,
  error
}: Omit<PostState, 'isReady'>) => {
  return {
    post,
    loading,
    error,
    isReady: !loading.isLoading && !error
  };
}; 