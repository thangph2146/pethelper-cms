import { useMemo } from 'react';
import { ANIMATIONS } from '@/constants/animations';
import type { PostMotionProps } from '@/types/post';

interface UsePostAnimationStateParams {
  isDisabled: boolean;
  isLoading: boolean;
}

export const usePostAnimationState = ({
  isDisabled,
  isLoading
}: UsePostAnimationStateParams) => {
  const motionProps = useMemo<PostMotionProps>(() => ({
    ...ANIMATIONS.postCard,
    whileHover: !isDisabled && !isLoading ? ANIMATIONS.postCard.hover : undefined,
    'aria-disabled': isDisabled,
    'aria-busy': isLoading
  }), [isDisabled, isLoading]);

  return {
    motionProps
  };
}; 