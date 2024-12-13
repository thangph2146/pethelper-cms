import { useMemo } from 'react';
import type { PostMotionProps, PostContentProps } from '@/types/post';
import type { LoadingProps } from '@/types/loading';
import { POST_CONFIG } from '@/constants/post-config';

interface WrapperDeps {
  wrapperProps: Record<string, unknown>;
  errorProps: {
    onReset: () => void;
    onError: (error: Error) => void;
  };
  loadingProps: LoadingProps;
  motionProps: PostMotionProps;
  contentProps: PostContentProps;
}

export const usePostWrapperProps = ({
  wrapperProps,
  errorProps,
  loadingProps,
  motionProps,
  contentProps
}: WrapperDeps) => {
  return useMemo(() => ({
    wrapperProps,
    errorProps,
    loadingProps,
    motionProps,
    contentProps,
    'data-testid': POST_CONFIG.testIds.card
  }), [
    wrapperProps,
    errorProps,
    loadingProps,
    motionProps,
    contentProps
  ]);
}; 