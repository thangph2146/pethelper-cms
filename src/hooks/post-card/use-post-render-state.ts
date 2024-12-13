import { useMemo } from 'react';
import type { PostState } from './use-post-state';
import type { PostWrapperProps } from '@/types/post';
import { usePostAccessibility } from './use-post-accessibility';

interface RenderState {
  isLoading: boolean;
  isError: boolean;
  isReady: boolean;
  wrapperProps: PostWrapperProps;
}

export const usePostRenderState = ({
  state,
  wrapperProps
}: {
  state: PostState;
  wrapperProps: PostWrapperProps;
}): RenderState => {
  const accessibilityProps = usePostAccessibility({
    post: state.post,
    isLoading: state.loading.isLoading,
    isError: state.error,
    isDisabled: !!wrapperProps.wrapperProps['aria-disabled']
  });

  return useMemo(() => ({
    isLoading: state.loading.isLoading,
    isError: state.error,
    isReady: state.isReady,
    wrapperProps: {
      ...wrapperProps,
      ...accessibilityProps
    }
  }), [state, wrapperProps, accessibilityProps]);
}; 