import { useMemo } from 'react';
import type { PostMotionProps, PostContentProps } from '@/types/post';
import type { LoadingProps } from '@/types/loading';

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

export const usePostWrapperDeps = ({
  propState,
  errorState,
  loadingStateProps,
  motionProps
}: {
  propState: { wrapperProps: Record<string, unknown>; contentProps: PostContentProps };
  errorState: { errorProps: WrapperDeps['errorProps'] };
  loadingStateProps: LoadingProps;
  motionProps: PostMotionProps;
}) => {
  return useMemo(() => ({
    wrapperProps: propState.wrapperProps,
    errorProps: errorState.errorProps,
    loadingProps: loadingStateProps,
    motionProps,
    contentProps: propState.contentProps
  }), [
    propState.wrapperProps,
    propState.contentProps,
    errorState.errorProps,
    loadingStateProps,
    motionProps
  ]);
}; 