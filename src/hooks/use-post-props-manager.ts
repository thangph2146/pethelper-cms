import { useMemo } from 'react';
import type { Post, PostCardView, PostRenderProps, PostHandlers, PostLoadingStates } from '@/types/post';
import { usePostCardProps } from './use-post-card-props';
import { usePostContentProps } from './use-post-content-props';
import { usePostAnimation } from './use-post-animation';
import { usePostWrapperProps } from './use-post-wrapper-props';
import { POST_CONFIG } from '@/constants/post-config';

interface UsePostPropsManagerParams {
  post: Post;
  view: PostCardView;
  handlers: PostHandlers;
  renderProps: PostRenderProps;
  loadingStates: PostLoadingStates;
  disableState: {
    'aria-disabled': boolean;
  };
  motionProps: any;
  isAnyLoading: boolean;
  showPreview: boolean;
  dialogs: any;
}

export const usePostPropsManager = (params: UsePostPropsManagerParams) => {
  // Memoize all props
  return useMemo(() => ({
    cardProps: usePostCardProps(params),
    contentProps: usePostContentProps(params),
    motionContainerProps: usePostAnimation(params),
    wrapperProps: usePostWrapperProps(params)
  }), [params]);
}; 